import { Content } from "./content";

export default function WaitlistPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <Content id={params.id} />;
}
