import Editor from '@/components/Editor';
import HeaderButtons from '@/components/HeaderButtons';

export default function Home() {
  return (
    <>
      <main className="mx-auto h-full w-full max-w-4xl">
        <Editor />
      </main>

      <HeaderButtons />
    </>
  );
}
