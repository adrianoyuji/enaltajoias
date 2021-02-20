import lines from "utils/jewels/lines";
import types from "utils/jewels/types";

const printJewelLine = (name: string) => {
  const line = lines.find((item) => item.value === name);
  return line ? line.title : "Linha não encontrada";
};
const printJewelType = (name: string) => {
  const type = types.find((item) => item.value === name);
  return type ? type.title : "Tipo não encontrado";
};

export { printJewelLine, printJewelType };
