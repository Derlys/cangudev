'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Image
                src="/logo.png"
                alt="Logo"
                width={102}
                height={42}
                className="rounded"
            />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CanguDev </h1>

          </div>
          <p className="text-slate-600 mb-8">Pega un párrafo técnico para analizar gramática y vocabulario C1.</p>

          <textarea
              className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              placeholder="Ej: I'm currently refactoring the authentication logic to improve security..."
              value={text}
              onChange={(e) => setText(e.target.value)}
          />

          <button
              onClick={analyzeText}
              disabled={loading || !text}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-300 transition-all"
          >
            {loading ? 'Analizando...' : 'Analizar Texto'}
          </button>

          {result && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-blue-600 mb-2">🚀 Pro Refactor (CTO Level)</h3>
                  <p className="text-slate-700 italic">"{result.refactor_pro}"</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-green-600 mb-2">💬 Casual (Slack/Team)</h3>
                  <p className="text-slate-700 italic">"{result.refactor_casual}"</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
                  <h3 className="font-bold text-purple-600 mb-2">🧠 Grammar Focus</h3>
                  <p className="text-slate-700">{result.grammar_focus}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-orange-600 mb-2">📚 Key Phrases</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.phrases.map((p: string, i: number) => (
                        <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-100">
                    {p}
                  </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200 bg-orange-50 md:col-span-1">
                  <h3 className="font-bold text-slate-800 mb-2">🎯 Challenge</h3>
                  <p className="text-slate-700">{result.challenge}</p>
                </div>
              </div>
          )}
        </div>
      </main>
  );
}