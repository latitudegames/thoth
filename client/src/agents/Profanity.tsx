
import { useState } from 'react';
import ProfanitySelectedEditor from "./ProfanitySelected";

const ProfanityEditor = () => {
  const [editor, setEditor] = useState(0);

  return (
    <div className="App">
      <div>
        {editor === 0 ? (
          <div>
            <h1>Profanity Editor</h1>
            <button onClick={() => setEditor(1)}>Bad Words</button><br /><br />
            <button onClick={() => setEditor(2)}>Sensitive Words</button><br /><br />
            <button onClick={() => setEditor(3)}>Sensitive Phrases</button><br /><br />
            <button onClick={() => setEditor(4)}>Leading Statements</button><br /><br />
          </div>
        ) : (
          <div>
            <ProfanitySelectedEditor editorId={editor} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfanityEditor;
