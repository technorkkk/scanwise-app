import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import ZAI from 'z-ai-web-dev-sdk';
import { DEMO_PRODUCTS } from '@/lib/constants';
import type { AISummaryResponse, ApiErrorResponse } from '@/lib/api-types';

// ─── Zod Validation Schema ─────────────────────────────────
const aiSummarySchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(200),
  ingredients: z.string().min(1, 'Ingredients list is required').max(2000),
  allergens: z.array(z.string()).max(20, 'Too many allergens').default([]),
  locale: z.enum(['en', 'hi']).default('en'),
});

// ─── Fallback Summary Generator ────────────────────────────
function generateFallbackSummary(
  productName: string,
  ingredients: string,
  allergens: string[]
): { summaryEn: string; summaryHi: string } {
  const allergenText =
    allergens.length > 0
      ? `This product contains allergens: ${allergens.join(', ')}.`
      : 'No common allergens were detected in this product.';

  const ingredientCount = ingredients.split(',').length;
  const processingNote =
    ingredientCount > 10
      ? 'This product has a long ingredient list, which may indicate higher processing.'
      : 'This product has a relatively short ingredient list.';

  const summaryEn = `${productName} analysis: ${processingNote} Based on the ingredients provided (${ingredients}), ${allergenText} Always check the packaging for the most accurate and up-to-date information. Consult a healthcare professional for personalized dietary advice.`;

  const summaryHi = `${productName} विश्लेषण: ${ingredientCount > 10 ? 'इस उत्पाद में सामग्री की सूची लंबी है, जो उच्च प्रसंस्करण का संकेत दे सकती है।' : 'इस उत्पाद में सामग्री की सूची अपेक्षाकृत छोटी है।'} दी गई सामग्री (${ingredients}) के आधार पर, ${allergens.length > 0 ? `इस उत्पाद में एलर्जी कारक हैं: ${allergens.join(', ')}।` : 'इस उत्पाद में कोई सामान्य एलर्जी कारक नहीं पाया गया।'} सबसे सटीक और अद्यतित जानकारी के लिए हमेशा पैकेजिंग की जांच करें। व्यक्तिगत आहार सलाह के लिए स्वास्थ्य पेशेवर से परामर्श करें।`;

  return { summaryEn, summaryHi };
}

// ─── POST /api/ai-summary ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = aiSummarySchema.safeParse(body);
    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { productName, ingredients, allergens, locale } = validation.data;

    // Try to find existing AI summary in demo data first
    const existingProduct = DEMO_PRODUCTS.find((p) => p.name === productName);
    if (existingProduct) {
      const response: AISummaryResponse = {
        success: true,
        summaryEn: existingProduct.ai_summary_en,
        summaryHi: existingProduct.ai_summary_hi,
        source: 'ai',
      };
      return NextResponse.json(response);
    }

    // Attempt AI generation using z-ai-web-dev-sdk
    try {
      const zai = await ZAI.create();

      const systemPrompt = `You are a professional nutritionist and food scientist. Analyze food products and provide clear, actionable health summaries. Always respond in the exact format requested. Be factual, mention both positives and concerns. Keep summaries concise (2-4 sentences).`;

      const userPrompt = `Analyze this food product and provide health summaries in BOTH English and Hindi.

Product: ${productName}
Ingredients: ${ingredients}
Allergens: ${allergens.length > 0 ? allergens.join(', ') : 'None detected'}

Respond in this EXACT JSON format only, no other text:
{"summaryEn": "English summary here", "summaryHi": "Hindi summary here"}`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
      });

      const content = completion.choices?.[0]?.message?.content;

      if (content) {
        // Try to parse JSON from the AI response
        let parsed: { summaryEn?: string; summaryHi?: string } | null = null;

        try {
          // First try direct JSON parse
          parsed = JSON.parse(content);
        } catch {
          // Try extracting JSON from markdown code blocks
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[1].trim());
          } else {
            // Try finding JSON object in the response
            const objectMatch = content.match(/\{[\s\S]*\}/);
            if (objectMatch) {
              parsed = JSON.parse(objectMatch[0]);
            }
          }
        }

        if (parsed?.summaryEn && parsed?.summaryHi) {
          const response: AISummaryResponse = {
            success: true,
            summaryEn: parsed.summaryEn,
            summaryHi: parsed.summaryHi,
            source: 'ai',
          };
          return NextResponse.json(response);
        }
      }
    } catch (aiError) {
      console.error('[AI Summary API] AI generation failed, using fallback:', aiError);
    }

    // Fallback to pre-written summary
    const fallback = generateFallbackSummary(productName, ingredients, allergens);
    const response: AISummaryResponse = {
      success: true,
      summaryEn: fallback.summaryEn,
      summaryHi: fallback.summaryHi,
      source: 'fallback',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AI Summary API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while generating AI summary',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
