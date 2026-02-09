import Button from "@/components/ui/Button";
import Logo from "./Logo";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-9 h-[10vh]">
      <ul className="w-[90%] mx-auto flex justify-between items-center">
        <li className="max-md:scale-90 max-md:origin-left">
          <Logo />
        </li>

        <li>
          <Button
            text="Contact"
            href="https://x.com/mertelia"
            className="
              max-md:[--btn-fs:0.9rem] 
              max-md:[--btn-h:1.2rem]
              md:[--btn-fs:1.56rem] 
              md:[--btn-h:1.75rem]
            "
          />
        </li>
      </ul>
    </nav>
  );
}
