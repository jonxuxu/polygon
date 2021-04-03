import React, { useEffect } from "react";
import axios from "axios";

const translateText = `आजकल विश्व के लगभग सारे देशों में डबलरोटी (ब्रेड) का उपयोग हो रहा है। लेकिन आधुनिक लोगों की पसंदीदा डबलरोटी आज से नहीं सदियों पहले से अस्तित्व में है। कहते हैं कि ईसा से 3000 वर्ष पूर्व मिस्र में डबल रोटी की शुरूआत हुई थी। वहां के लोग गुंधे हुए आटे में खमीर मिली टिकिया को भट्टी में पकाकर डबलरोटी बनाते थे। इस प्रकार डबलरोटी बनाने के नमूने मिस्र के मकबरों में मिलते हैं।`;

export default function TranslatePage() {
  useEffect(() => {
    axios.get("/api/translate", {
      params: { text: translateText, target: "en" },
    });
  }, []);

  return <div>Poggers!</div>;
}
