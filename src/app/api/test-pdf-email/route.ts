import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_TEST_ENDPOINTS) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  const payload = {
    userProfile: {
      name: "Deep Tanti",
      email: "hello@clarivisintelligence.com",
      phone: "+91 98765 43210",
      company: "Test Company",
      industry: "Real Estate",
      teamSize: "11 to 30",
      mainChallenge: "Leads come in from multiple sources but response time is too slow and we lose deals to competitors who call first. No single view of the pipeline.",
      tools: ["WhatsApp", "Excel or Sheets"],
      aiExperience: "Yes, with mixed results",
      successDefinition: "Every lead gets followed up within 60 seconds and I can see my full pipeline in one place."
    },
    conversationHistory: [
      { role: "assistant", content: "Hi Deep, thanks for taking the time today. You mentioned slow lead response is your biggest challenge — how many leads are you typically receiving per week, and where are they coming from?" },
      { role: "user", content: "We get around 40 to 50 leads a week. Mix of 99acres, housing.com, Instagram, and direct referrals. The problem is they all land in different places and by the time someone follows up it's been 2 or 3 hours sometimes." },
      { role: "assistant", content: "That delay is significant in real estate — a 2 to 3 hour response time likely means you're losing 30 to 40 percent of those leads to whoever called first. How is your team currently managing follow-up — is there a designated person or does it fall on multiple people?" },
      { role: "user", content: "It's supposed to be the sales team but honestly it's chaotic. Three people share a WhatsApp group and whoever sees it first picks it up. Sometimes no one does. No tracking at all." },
      { role: "assistant", content: "So you have no visibility into whether a lead was contacted, who owns it, or what stage it's at. Given 40 to 50 leads a week at an average ticket of — what would you say your typical deal size is?" },
      { role: "user", content: "Ranges a lot. Budget projects around 40 to 50 lakhs, premium ones go up to 2 crore plus." },
      { role: "assistant", content: "Even at the lower end, losing 15 to 20 leads a month to slow follow-up represents serious revenue. Has the team tried any CRM or are you purely on WhatsApp and Excel right now?" },
      { role: "user", content: "We tried one CRM about a year ago. Nobody used it. It was too complicated and nobody had time to log things manually. Went back to WhatsApp within two months." },
      { role: "assistant", content: "That's very common — adoption fails when the system creates work instead of removing it. The solution has to meet the team where they already are. What would success look like for you in 90 days if we fixed this?" },
      { role: "user", content: "Every lead gets a call within a minute of coming in, automatically. And I can open something on my phone and see exactly where every deal stands without asking anyone." }
    ],
    timeSelected: 10,
    snapshotContent: {
      executiveSummary: "Test Company is losing an estimated 15 to 20 qualified leads per month due to slow follow-up response times and a fragmented lead management process split across WhatsApp, Excel, and three sales team members with no central ownership. With deal sizes ranging from ₹40 lakhs to ₹2 crore, each lost lead represents significant revenue. The business has the team and the volume to benefit immediately from AI-powered lead response and pipeline visibility.",
      readinessScore: 72,
      recommendedFirstStep: "Deploy an AI lead qualifier on your highest-volume inbound channel — likely 99acres or Instagram — to automatically respond and qualify within 60 seconds. Run it in parallel with your existing process for 30 days and measure the difference in site visit conversion rate.",
      opportunities: null
    }
  };

  try {
    // Construct the absolute URL dynamically from the incoming request URL
    const apiUrl = new URL('/api/generate-pdf', request.url).toString();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Test email sent to hello@clarivisintelligence.com' });
    } else {
      return NextResponse.json({ success: false, error: data.error || 'Unknown error from pipeline' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test PDF endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
