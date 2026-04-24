const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: "Return website config in JSON: {title, primaryColor, heroTitle}" },
                   { role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });
    const config = JSON.parse(completion.choices[0].message.content);
    await supabase.from('user_sites').insert({ config }); // บันทึกลง Supabase ทันที
    res.status(200).json(config);
}
