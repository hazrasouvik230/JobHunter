export default function currencyFormatter({ amount, currencyCode = "INR" }) {
    if(typeof amount !== "number" || isNaN(amount)) {
        return "Invalid amount";
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0
    }).format(amount);
};