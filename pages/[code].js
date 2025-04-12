import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getServerSideProps({ params }) {
  const snap = await getDoc(doc(db, 'urls', params.code));
  if (snap.exists()) {
    return {
      redirect: { destination: snap.data().url, permanent: false },
    };
  }
  return { notFound: true };
}

export default function RedirectPage() {
  return <p>리디렉션 중...</p>;
}