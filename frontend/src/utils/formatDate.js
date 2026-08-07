export function formatDate(dateValue) {
  if (!dateValue) return "No date";
  
  try {
    // Convert to Date object if it's a string
    const date = new Date(dateValue);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      return String(dateValue);
    }
    
    // Format as: "Nov 17, 2025, 2:34 PM"
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return String(dateValue);
  }
}