import Button from "../../Button";

export default function Footer() {
  return (
    <footer>
      <div className="w-screen h-[30vh] flex flex-col justify-start items-center gap-8 ">
        <div className="flex justify-center items-center h-4 gap-2">
          <div className="h-full w-4 bg-main"></div>
          <div className="text-main pr-2 text-lg whitespace-nowrap">
            <span className="tracking-tight">EVENT</span>
            <span className="mx-1">&</span>
            <span className="tracking-tight">CONCERT</span>
            <span> MANAGEMENT</span>
          </div>
        </div>
        <div className="text-white text-lg text-center tracking-[-0.08em] w-[50%]">
          Stay in the know by subscribing to our newsletter! By signin up, you
          agree to our privacy policy, and of course, you're free to unsubscribe
          at any time.
        </div>
        <div>
          <Button
            fs={25}
            height={28}
            text="contact@flowstage.com"
            href="https://x.com/mertelia"
          />
        </div>
      </div>
    </footer>
  );
}
