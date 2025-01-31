import { useMediaQuery } from "react-responsive";
import TocButton from "./toc-button";
import TocDrawer from "./toc-drawer";

type TableOfContentProps = {
  hasToc: boolean;
  isTocOpen: boolean;
  setTocOpen: (isOpen: boolean) => void;
};
const TableOfContent = ({
  hasToc,
  isTocOpen,
  setTocOpen,
}: TableOfContentProps) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  if (!hasToc) return null;
  return (
    <>
      {!isTocOpen && !isTabletOrMobile && (
        <TocButton onClick={() => setTocOpen(true)} />
      )}

      <TocDrawer
        isDrawerOpen={isTocOpen}
        setOpenDrawer={(openDrawer) => setTocOpen(openDrawer)}
      />
    </>
  );
};

export default TableOfContent;
