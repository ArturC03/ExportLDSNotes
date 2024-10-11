import csvtojson from "csvtojson";

function transformKey(key: string): string {
  // Convert to camelCase
  return key.toLowerCase().replace(/[\s-]+(\w)/g, (_, p1) => p1.toUpperCase());
}

export async function csvToJson(csvContent: string) {
  try {
    const jsonArray = await csvtojson().fromString(csvContent);

    // Transform the keys of each object in the array
    const transformedArray = jsonArray.map((obj) => {
      const newObj: { [key: string]: any } = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = transformKey(key);
          newObj[newKey] = obj[key];
        }
      }
      return newObj;
    });

    console.log(transformedArray);
    return transformedArray;
  } catch (error) {
    console.error("Error converting CSV to JSON:", error);
    throw error;
  }
}
