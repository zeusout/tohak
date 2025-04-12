import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [url, setUrl] = useState('');
  const [custom, setCustom] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [newCode, setNewCode] = useState('');

  const generate = () => Math.random().toString(36).substring(2, 8);

  const handleShorten = async () => {
    const shortCode = custom || generate();
    await setDoc(doc(db, 'urls', shortCode), { url });
    setCode(shortCode);
    setMsg(`https://tohak.xyz/${shortCode}`);
  };

  const handleEdit = async () => {
    const docRef = doc(db, 'urls', code);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await setDoc(doc(db, 'urls', newCode), { url: snap.data().url });
      await deleteDoc(docRef); // delete old code
      setCode(newCode);
      setMsg(`https://tohak.xyz/${newCode}`);
      setEditing(false);
    }
  };

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>🔗 tohak 단축링크</h1>
      <input placeholder="긴 URL" value={url} onChange={e => setUrl(e.target.value)} style={{ width: '100%', padding: 8 }} />
      <input placeholder="커스텀 코드 (선택)" value={custom} onChange={e => setCustom(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 10 }} />
      <button onClick={handleShorten} style={{ marginTop: 10 }}>단축</button>

      {msg && (
        <div style={{ marginTop: 20 }}>
          <p><a href={msg} target="_blank">{msg}</a></p>
          {!editing ? (
            <button onClick={() => setEditing(true)}>🔧 코드 수정</button>
          ) : (
            <>
              <input placeholder="새 코드 입력" value={newCode} onChange={e => setNewCode(e.target.value)} style={{ padding: 6 }} />
              <button onClick={handleEdit}>변경</button>
            </>
          )}
        </div>
      )}
    </main>
  );
}