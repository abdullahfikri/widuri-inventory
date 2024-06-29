export class Utilities {
  static convertStringPriceToDecimal(price: string): string {
    if (!price) {
      return null;
    }
    const convertStr = parseFloat(price.replace(',', '.'));
    return convertStr.toFixed(2);
  }
}
