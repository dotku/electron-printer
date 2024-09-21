import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import OrderButton from "../components/OrderButton";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Special</p>
          <small className="text-default-500">$12.99</small>
          <h4 className="font-bold text-large">Chicken Plate</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://onohawaiianbbq.com/wp-content/uploads/2021/07/BBQ-Chicken.jpg"
            width={270}
          />
        </CardBody>
      </Card>
      <OrderButton />
    </section>
  );
}
