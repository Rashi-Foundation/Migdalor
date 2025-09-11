const logger = {
  // Format timestamp for consistent logging
  getTimestamp() {
    return new Date().toISOString().replace("T", " ").substring(0, 19);
  },

  // Log route access with method, path, and status
  logRoute(method, path, status, message = "") {
    const timestamp = this.getTimestamp();
    const statusEmoji =
      status >= 200 && status < 300 ? "✅" : status >= 400 ? "❌" : "⚠️";
    console.log(
      `${timestamp} ${statusEmoji} ${method} ${path} - ${status} ${message}`
    );
  },

  // Log successful operations
  success(operation, details = "") {
    const timestamp = this.getTimestamp();
    console.log(
      `${timestamp} ✅ ${operation}${details ? ` - ${details}` : ""}`
    );
  },

  // Log errors
  error(operation, error) {
    const timestamp = this.getTimestamp();
    console.log(`${timestamp} ❌ ${operation} - ${error.message || error}`);
  },

  // Log info messages
  info(message) {
    const timestamp = this.getTimestamp();
    console.log(`${timestamp} ℹ️  ${message}`);
  },

  // Log database operations
  db(operation, collection = "") {
    const timestamp = this.getTimestamp();
    console.log(
      `${timestamp} 🗄️  DB ${operation}${collection ? ` (${collection})` : ""}`
    );
  },

  // Log authentication events
  auth(event, user = "") {
    const timestamp = this.getTimestamp();
    console.log(`${timestamp} 🔐 AUTH ${event}${user ? ` - ${user}` : ""}`);
  },

  // Log report generation (simplified)
  report(type, details = "") {
    const timestamp = this.getTimestamp();
    console.log(
      `${timestamp} 📊 REPORT ${type}${details ? ` - ${details}` : ""}`
    );
  },
};

module.exports = logger;
