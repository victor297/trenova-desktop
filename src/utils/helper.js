export const getLocalGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
  
    let greeting;
  
    if (hours >= 5 && hours < 12) {
      greeting = "Good morning!";
    } else if (hours >= 12 && hours < 17) {
      greeting = "Good afternoon!";
    } else {
      greeting = "Good evening!";
    }
  
    return greeting;
};
  
export const removeSlashes = (inputString) => {
  return inputString.replace(/[^a-zA-Z0-9_().]/g, ' ');
}
export function roundUpToDecimal(number, decimalPlaces = 1) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.ceil(number * factor) / factor;
}
