/**
 * Tiptap JSON document helper for Tibeb.
 * Converts various AI outputs into a structured JSON object compatible with StarterKit.
 */

export function createTiptapDoc(content: string | any[], type: 'text' | 'flashcards' | 'questions'): object {
  const nodes: any[] = [];

  if (type === 'text' && typeof content === 'string') {
    // Basic text paragraphs
    content.split('\n').filter(l => l.trim()).forEach(line => {
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: line }]
      });
    });
  } else if (type === 'flashcards' && Array.isArray(content)) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'AI Flashcards' }]
    });

    content.forEach(card => {
      nodes.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: `Q: ${card.prompt}` }]
      });
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: `A: ${card.answer}` }]
      });
    });
  } else if (type === 'questions' && Array.isArray(content)) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'AI Practice Questions' }]
    });

    content.forEach((q, i) => {
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: `${i + 1}. ${q.questionText || q.question_text}` }]
      });
      if (q.choices) {
        nodes.push({
          type: 'bulletList',
          content: q.choices.map((c: string) => ({
            type: 'listItem',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: c }] }]
          }))
        });
      }
      nodes.push({
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Correct Answer: ', marks: [{ type: 'bold' }] },
          { type: 'text', text: q.correctAnswer || q.correct_answer }
        ]
      });
    });
  }

  return {
    type: 'doc',
    content: nodes.length > 0 ? nodes : [{ type: 'paragraph' }]
  };
}
