'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Wat is de huidige voorraadstatus?',
  'Welke orders moeten vandaag verzonden worden?',
  'Toon mij producten met lage voorraad',
  'Wat zijn de prestaties van deze week?',
  'Help mij met een cycle count plannen',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hallo! Ik ben je WMS AI Assistent. Ik kan je helpen met vragen over voorraad, orders, rapporten en meer. Waar kan ik je mee helpen?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        voorraad: 'Op dit moment heb je 1,234 unieke producten in voorraad met een totaal van 45,678 stuks. Er zijn 12 producten onder het minimum niveau.',
        orders: 'Er staan vandaag 23 orders gepland voor verzending. Hiervan zijn er 15 al gepickt en klaar voor verzending.',
        prestaties: 'Deze week zijn er 156 orders verwerkt met een nauwkeurigheid van 99.2%. De gemiddelde doorlooptijd was 2.3 uur.',
        default: 'Ik begrijp je vraag. Op basis van de beschikbare gegevens kan ik je verder helpen. Kun je specifieker zijn over wat je wilt weten?',
      };

      let response = responses.default;
      const lowerInput = userMessage.content.toLowerCase();

      if (lowerInput.includes('voorraad') || lowerInput.includes('stock')) {
        response = responses.voorraad;
      } else if (lowerInput.includes('order') || lowerInput.includes('verzend')) {
        response = responses.orders;
      } else if (lowerInput.includes('prestatie') || lowerInput.includes('week')) {
        response = responses.prestaties;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hallo! Ik ben je WMS AI Assistent. Ik kan je helpen met vragen over voorraad, orders, rapporten en meer. Waar kan ik je mee helpen?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-8 w-8" />
            AI Assistent
          </h1>
          <p className="text-muted-foreground">
            Stel vragen over je magazijn en krijg directe antwoorden
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Nieuwe Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === 'assistant'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Stel een vraag..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                Suggesties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestion(question)}
                  className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mogelijkheden</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Voorraad queries en analyses
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Order status en tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Prestatie rapporten
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Aanbevelingen en optimalisatie
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Natuurlijke taal zoekopdrachten
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
