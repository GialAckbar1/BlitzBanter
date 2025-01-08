import styles from "./page.module.css"
import pic from "./comps/pics/HeaderPic.png"
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (

    
  <main className={styles.main}>
    <title>BlitzBanter - Home </title>
    <div className={styles.stickybar}>
      <button className={styles.login}>
      Log In
      </button>
      
      <Link href="./signup" className={styles.signup}>
        Sign Up
      </Link>
      
    </div>
    <h1 className={styles.header}>
      Trash Talk Meets Tactics
    </h1>
    <p className={styles.subheading}>
    Where sharp moves meet banter—bring your game and your wits. Play chess with live video and voice.
    </p>
    <h3 className={styles.infoheader}>
      What’s BlitzBanter?
    </h3>
    <Image src={pic} alt="My Image" className={styles.pic}/>    
  
    <p className={styles.paragraph}>
    BlitzBanter is more than just online chess—it’s where strategy meets conversation. Play fast-paced games with live video and voice chat, bringing the intensity of over-the-board play to the digital world. Outsmart your opponents, outtalk them, and make every match an experience worth remembering.
    </p>
    <div style={{marginTop: "500px"}}>0</div>
  </main>













)

  
  
  
  
  ;
}
