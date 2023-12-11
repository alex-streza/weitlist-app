import { Content } from "./content";

export default function WaitlistPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  console.log("params", params);

  return <Content id={params.id} />;
}
