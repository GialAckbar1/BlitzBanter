"use client"
import { useState } from "react";
import styles from "./page.module.css";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className={styles.main}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <div className={styles.text}>Email</div>
        <input
          className={styles.signupbox}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className={styles.text2}>Password</div>
        <input
          className={styles.passbox}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className={styles.signupbtn} type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}
