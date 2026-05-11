import { useCallback, useMemo, useState } from 'react';
import { DynamicForm } from 'pdyform-react';
import type { FormSchema } from 'pdyform-core';
import { defaultSchema } from '../../shared/defaultSchema';

const prettyJSON = (value: unknown): string => JSON.stringify(value, null, 2);

export default function App() {
  const initialText = useMemo(() => prettyJSON(defaultSchema), []);
  const [schemaText, setSchemaText] = useState(initialText);
  const [schema, setSchema] = useState<FormSchema>(defaultSchema);
  const [parseError, setParseError] = useState<string>('');
  const [submitResult, setSubmitResult] = useState<string>('');

  const handleSchemaChange = useCallback((nextText: string) => {
    setSchemaText(nextText);

    try {
      const parsed = JSON.parse(nextText) as FormSchema;
      if (!parsed || !Array.isArray(parsed.fields)) {
        setParseError('Schema must contain a fields array.');
        return;
      }
      setSchema(parsed);
      setParseError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      setParseError(message);
    }
  }, []);

  const handleSubmit = useCallback((values: Record<string, unknown>) => {
    console.log('Form submitted with values:', values);
    setSubmitResult(prettyJSON(values));
  }, []);

  return (
    <main className="page">
      <header>
        <h1>pdyform React Demo</h1>
        <p>Edit schema JSON on the left and validate render/submit behavior on the right.</p>
      </header>

      <section className="grid">
        <div className="panel">
          <h2>Schema Editor</h2>
          <textarea
            value={schemaText}
            onChange={(event) => handleSchemaChange(event.target.value)}
            spellCheck={false}
          />
          {parseError ? <p className="error">JSON Parse Error: {parseError}</p> : <p className="ok">Schema is valid.</p>}
        </div>

        <div className="panel">
          <h2>Rendered Form</h2>
          <DynamicForm schema={schema} onSubmit={handleSubmit} />

          <h3>Submit Payload</h3>
          <pre>{submitResult || 'Submit the form to inspect values.'}</pre>
        </div>
      </section>
    </main>
  );
}
