import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100wh",
      }}
    >
      <Image src={loader} height={140} width={140} alt="loading..."></Image>
    </div>
  );
};
export default LoadingPage;
