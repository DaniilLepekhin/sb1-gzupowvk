import OpenAI from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
});

export async function generateMeditationText(theme: string): Promise<string> {
  const prompt = `Создай расслабляющую медитацию на тему "${theme}". 
  Медитация должна быть спокойной, умиротворяющей и длиться примерно 10-15 минут.
  Используй мягкий, успокаивающий язык. Включи паузы для дыхания и визуализации.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || '';
}

export async function generateMeditationAudio(text: string): Promise<string> {
  const speechResponse = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova", // мягкий женский голос
    input: text,
  });

  const speechBlob = await speechResponse.blob();
  const speechUrl = URL.createObjectURL(speechBlob);

  // Генерируем фоновую музыку
  const musicResponse = await replicate.run(
    "meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7",
    {
      input: {
        prompt: "Peaceful meditation ambient music with soft pads and gentle bells, very calming and relaxing",
        duration: 600 // 10 минут
      }
    }
  );

  // Здесь нужно будет смешать аудио дорожки
  // Пока возвращаем только речь
  return speechUrl;
}

export async function generateMeditation(theme: string): Promise<{ text: string; audioUrl: string }> {
  const meditationText = await generateMeditationText(theme);
  const audioUrl = await generateMeditationAudio(meditationText);

  return {
    text: meditationText,
    audioUrl
  };
}