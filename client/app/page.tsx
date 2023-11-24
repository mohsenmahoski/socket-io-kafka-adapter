import { CreateCanvas } from "@/components/createCanvas";

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main>
      <CreateCanvas port={searchParams?.port as string} />
    </main>
  )
}
