import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { printJewelLine } from "utils/jewels";
import types from "utils/jewels/types";

interface Props {
  jewelList: Jewel[];
  briefcaseName: string;
  total: number;
}
interface Jewel {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
  purchase_price: number;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 16,
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  tableHeader: {
    paddingVertical: 6,
    display: "flex",
    flexDirection: "row",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableId: { flex: 1, fontSize: 16, textAlign: "left", paddingHorizontal: 4 },
  tableItemName: {
    flex: 4,
    fontSize: 16,
    textAlign: "left",
    paddingHorizontal: 4,
  },
  tableLine: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
    paddingHorizontal: 8,
  },
  tablePrice: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
    paddingHorizontal: 4,
  },
  title: {
    marginVertical: 8,
    fontSize: 22,
  },
  total: {
    textAlign: "right",
    marginVertical: 8,
    fontSize: 22,
  },
  test: {
    margin: 8,
    fontSize: 22,
  },
});

const BriefcasePDF = ({ jewelList, briefcaseName, total }: Props) => {
  console.log("props", jewelList);
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.title}>{briefcaseName}</Text>
          {types.map((type, index) => {
            const items = jewelList.filter(
              (jewel) => jewel.type === type.value
            );
            return (
              !!items.length && (
                <View key={index} style={styles.container}>
                  <Text style={styles.title}>{type.title}</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableId}>Código</Text>
                    <Text style={styles.tableItemName}>Jóia</Text>
                    <Text style={styles.tableLine}>Linha</Text>
                    <Text style={styles.tablePrice}>Preço</Text>
                  </View>
                  {items.map((jewel_item, index) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableId}>{jewel_item.jewelId}</Text>
                      <Text style={styles.tableItemName}>
                        {jewel_item.name}
                      </Text>
                      <Text style={styles.tableLine}>
                        {printJewelLine(jewel_item.line)}
                      </Text>
                      <Text style={styles.tablePrice}>
                        R$ {(jewel_item.price / 100).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )
            );
          })}
          <Text style={styles.total}>Total: R$ {(total / 100).toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BriefcasePDF;
