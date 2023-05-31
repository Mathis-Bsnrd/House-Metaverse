const Navbar = ({ web3Handler, account }) => {
  return (
    <nav>
      <a
        href={`${""}/address/${account}`}
        target="_blank"
        rel="noopener noreferrer"
        className="button"
      >
        {account.slice(0, 5) + "..." + account.slice(38, 42)}
      </a>
    </nav>
  );
};

export default Navbar;
