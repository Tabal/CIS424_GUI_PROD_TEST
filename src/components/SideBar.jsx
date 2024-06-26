import "../styles/PageStyles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import routes from "../routes.js";
import { useAuth } from "../AuthProvider.js";
import logo from "../newLogo.png";
import {
  Home,
  Sun,
  Moon,
  HandCoins,
  PiggyBank,
  ChevronRight,
  ChevronDown,
  KeyRound,
  AlignHorizontalDistributeCenter,
  BookMarked,
  Table,
  Lock,
  CreditCard,
  UserRound,
  LogOut,
} from "lucide-react";

//test variables
let testPermissions = 1;

const SideBar = (props) => {
  //used to navigate to a new route page when calling a function
  const navigate = useNavigate();
  const auth = useAuth();

  //Constants
  const HOME_PAGE_NAME = 0;
  const OPEN_DAY_PAGE_NAME = 1;
  const CLOSE_DAY_PAGE_NAME = 2;
  const TRANSFER_FUNDS_PAGE_NAME = 3;
  const SAFE_AUDIT_PAGE_NAME = 4;
  const VARIANCE_AUDIT_PAGE_NAME = 5;
  const VARIANCE_TABLE_PAGE_NAME = 6;
  const DEPOSIT_HISTORY_PAGE_NAME = 7;
  const USER_MANAGEMENT_PAGE_NAME = 8;
  const POS_MANAGEMENT_PAGE_NAME = 9;

  // State of cash manager dropdown menu
  const [cashManagerOn, setCashManager] = useState(
    props.currentPage === SAFE_AUDIT_PAGE_NAME ||
      props.currentPage === VARIANCE_AUDIT_PAGE_NAME ||
      props.currentPage === VARIANCE_TABLE_PAGE_NAME ||
      props.currentPage === DEPOSIT_HISTORY_PAGE_NAME
  );

  // State of security dropdown menu
  const [securityOn, setSecurity] = useState(
    props.currentPage === USER_MANAGEMENT_PAGE_NAME ||
      props.currentPage === POS_MANAGEMENT_PAGE_NAME
  );

  //functions to navigate user through pages. See html code below for calling these
  function toHome() {
    navigate(routes.home);
  }
  function toOpenDay() {
    navigate(routes.openday);
  }
  function toCloseDay() {
    navigate(routes.closeday);
  }
  function toTransferFunds() {
    navigate(routes.fundstransfer);
  }
  function toSafeAudit() {
    navigate(routes.safeaudit);
  }
  function toVarianceAudit() {
    navigate(routes.varianceaudit);
  }
  function toVarianceTable() {
    navigate(routes.variancetable);
  }
  function toDepositHistory() {
    navigate(routes.deposithistory);
  }
  function toUserManagement() {
    navigate(routes.usermanagement);
  }
  function toPosManagement() {
    navigate(routes.posmanagement);
  }
  function signOut() {
    auth.logOut();
    navigate(routes.signout);
  }

  return (
    <aside className="min-h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src={logo} className="w-64" alt="Plato's Closet Logo" />
        </div>
        <ul className="flex-1 p-3">
          {/* TM: Would be otpimal to pass in children list items (for reusability) but I don't really want to. This will work just fine. */}
          <hr className="mb-3 border-gray-300" />

          {/* Home page button */}
          <li
            onClick={toHome}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
                 transition-colors ${
                   props.currentPage === HOME_PAGE_NAME
                     ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                     : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
                 }`}
          >
            <Home />
            <span className="ml-3">Home</span>
          </li>

          {/* Open Day page button */}
          <li
            onClick={toOpenDay}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
                 transition-colors ${
                   props.currentPage === OPEN_DAY_PAGE_NAME
                     ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                     : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
                 }`}
          >
            <Sun />
            <span className="ml-3">Open Day</span>
          </li>

          {/* Close Day page button */}
          <li
            onClick={toCloseDay}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
                 transition-colors ${
                   props.currentPage === CLOSE_DAY_PAGE_NAME
                     ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                     : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
                 }`}
          >
            <Moon />
            <span className="ml-3">Close Day</span>
          </li>

          {/* Transfer Funds page button */}
          <li
            onClick={toTransferFunds}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
                 transition-colors ${
                   props.currentPage === TRANSFER_FUNDS_PAGE_NAME
                     ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                     : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
                 }`}
          >
            <HandCoins />
            <span className="ml-3">Transfer Funds</span>
          </li>

          {/* Cash Manager dropdown menu button */}
          <li
            onClick={() => {
              if (
                props.currentPage !== SAFE_AUDIT_PAGE_NAME &&
                props.currentPage !== VARIANCE_AUDIT_PAGE_NAME &&
                props.currentPage !== VARIANCE_TABLE_PAGE_NAME &&
                props.currentPage !== DEPOSIT_HISTORY_PAGE_NAME
              ) {
                setCashManager(!cashManagerOn);
              }
            }}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors text-gray-600 ${
              props.currentPage !== SAFE_AUDIT_PAGE_NAME &&
              props.currentPage !== VARIANCE_AUDIT_PAGE_NAME &&
              props.currentPage !== VARIANCE_TABLE_PAGE_NAME &&
              props.currentPage !== DEPOSIT_HISTORY_PAGE_NAME
                ? "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800"
                : ""
            }`}
          >
            <PiggyBank />
            <span className="ml-3">Cash Manager</span>

            {cashManagerOn ? (
              <ChevronDown className="ml-6" />
            ) : (
              <ChevronRight className="ml-6" />
            )}
          </li>

          {cashManagerOn && <hr className="border-gray-300" />}
          {/* Safe Audit page button */}
          {cashManagerOn && (
            <li
              onClick={toSafeAudit}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === SAFE_AUDIT_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <KeyRound />
              <span className="ml-3">Safe Audit</span>
            </li>
          )}
          {/* Variance Audit page button */}
          {cashManagerOn && (
            <li
              onClick={toVarianceAudit}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === VARIANCE_AUDIT_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <AlignHorizontalDistributeCenter />
              <span className="ml-3">Variance Audit</span>
            </li>
          )}
          {/* Variance Report page button */}
          {cashManagerOn && (
            <li
              onClick={toVarianceTable}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === VARIANCE_TABLE_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <Table />
              <span className="ml-3">Variance Report</span>
            </li>
          )}
          {/* Deposit History page button */}
          {cashManagerOn && (
            <li
              onClick={toDepositHistory}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === DEPOSIT_HISTORY_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <BookMarked />
              <span className="ml-3">Deposit History</span>
            </li>
          )}
          {cashManagerOn && <hr className="border-gray-300" />}

          {/* Security dropdown menu button */}
          {auth.cookie.user.position !== "Team Leader" && (
            <li
              onClick={() => {
                if (
                  props.currentPage !== USER_MANAGEMENT_PAGE_NAME &&
                  props.currentPage !== POS_MANAGEMENT_PAGE_NAME
                ) {
                  setSecurity(!securityOn);
                }
              }}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors text-gray-600 ${
              props.currentPage !== USER_MANAGEMENT_PAGE_NAME &&
              props.currentPage !== POS_MANAGEMENT_PAGE_NAME
                ? "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800"
                : ""
            }`}
            >
              <Lock />
              <span className="ml-3">Security</span>

              {securityOn ? (
                <ChevronDown className="ml-16" />
              ) : (
                <ChevronRight className="ml-16" />
              )}
            </li>
          )}

          {securityOn && <hr className="border-gray-300" />}
          {/* User Management page button */}
          {securityOn && (
            <li
              onClick={toUserManagement}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === USER_MANAGEMENT_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <UserRound />
              <span className="ml-3">User Management</span>
            </li>
          )}
          {/* POS Management page button */}
          {securityOn && auth.cookie.user.position === "Owner" && (
            <li
              onClick={toPosManagement}
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
            transition-colors ${
              props.currentPage === POS_MANAGEMENT_PAGE_NAME
                ? "bg-gradient-to-tr from-custom-accent to-custom-accent-light text-gray-800"
                : "hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 text-gray-600"
            }`}
            >
              <CreditCard />
              <span className="ml-3">POS Management</span>
            </li>
          )}
          <hr className="my-3 border-gray-300" />
          {/* Logout button */}
          <li
            onClick={signOut}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer 
                 transition-colors hover:bg-gradient-to-tr from-gray-300 to-gray-200 hover:text-gray-800 
                 text-gray-600`}
          >
            <LogOut />
            <span className="ml-3">Sign Out</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
