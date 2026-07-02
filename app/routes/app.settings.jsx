export default function Settings() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>Settings</h1>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid #e1e3e5" }}>
            <h2 style={{ marginTop: 0 }}>Company Information</h2>
            <div style={{ marginTop: "16px", color: "#202223" }}>
              <p style={{ margin: "6px 0" }}><strong>Business Name:</strong>Growify Digital LLP</p>
              <p style={{ margin: "6px 0" }}><strong>Address:</strong> 3rd Floor, D-112, 60 Feet Rd, Pocket D, Chattarpur Enclave, Chhatarpur, New Delhi, Delhi 110074</p>
            </div>
          </div>

          <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid #e1e3e5" }}>
            <h2 style={{ marginTop: 0 }}>Contact Information</h2>
            <div style={{ marginTop: "16px", color: "#202223" }}>
              <p style={{ margin: "6px 0" }}><strong>Email:</strong> karanbaro.kb@gmail.com</p>
              <p style={{ margin: "6px 0" }}><strong>Phone:</strong> +91 8107895012</p>
              <p style={{ margin: "6px 0" }}><strong>Support Hours:</strong> Mon - Fri, 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
