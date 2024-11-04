import Header from '@/app/_components/layout/header';

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      
      {children}
    </>
  );
};
