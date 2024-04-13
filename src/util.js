export function addCommaInNumber(number) {
    if (!number) {
        return "0";
    }

    const numberString = number.toString();

    const parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    parts[1] = parts[1] ? parts[1].substring(0, 2) : "";

    return parts[1] ? parts.join(".") : parts[0];
}
