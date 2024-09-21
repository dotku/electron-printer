"use client";

import { Button } from "@nextui-org/button";

export default function OrderButton() {
  const handleOrderButtonClick = () => {
    window.electron &&
      window.electron.sendCommand({
        name: "Chiken Plate Combo",
        price: "12.99",
        number: 1,
      });
  };

  return <Button onClick={handleOrderButtonClick}>Order 2</Button>;
}
