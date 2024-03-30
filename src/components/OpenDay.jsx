import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from 'sonner';
import classNames from 'classnames';

const OpenDayPage = () =>{
    const auth = useAuth();

    //pos-related data
    const [posHasLoaded, SetPosHasLoaded] = useState(false);
    const [poss, setPoss] = useState([]);
    const [currentPosIndex, SetCurrentPosIndex] = useState(-1);
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("show extras ▼");

    //dom fields
    const [elmPennies, setElmPennies] = useState(0);
    const [elmNickles, setElmNickles] = useState(0);
    const [elmDimes, setElmDimes] = useState(0);
    const [elmQuarters, setElmQuarters] = useState(0);
    const [elmPenniesRolled, setElmPenniesRolled] = useState(0);
    const [elmNicklesRolled, setElmNicklesRolled] = useState(0);
    const [elmDimesRolled, setElmDimesRolled] = useState(0);
    const [elmQuartersRolled, setElmQuartersRolled] = useState(0);
    const [elm1Dollar, setElm1Dollar] = useState(0);
    const [elm5Dollar, setElm5Dollar] = useState(0);
    const [elm10Dollar, setElm10Dollar] = useState(0);
    const [elm20Dollar, setElm20Dollar] = useState(0);
    const [elm50Dollar, setElm50Dollar] = useState(0);
    const [elm100Dollar, setElm100Dollar] = useState(0);
    const [elm1DollarCoin, setElm1DollarCoin] = useState(0);
    const [elm2Dollar, setElm2Dollar] = useState(0);
    const [elmHalfDollarCoin, setElmHalfDollarCoin] = useState(0);

    //i hate this
    const [elmPenniesExpected, setElmPenniesExpected] = useState(0);
    const [elmNicklesExpected, setElmNicklesExpected] = useState(0);
    const [elmDimesExpected, setElmDimesExpected] = useState(0);
    const [elmQuartersExpected, setElmQuartersExpected] = useState(0);
    const [elmPenniesRolledExpected, setElmPenniesRolledExpected] = useState(0);
    const [elmNicklesRolledExpected, setElmNicklesRolledExpected] = useState(0);
    const [elmDimesRolledExpected, setElmDimesRolledExpected] = useState(0);
    const [elmQuartersRolledExpected, setElmQuartersRolledExpected] = useState(0);
    const [elm1DollarExpected, setElm1DollarExpected] = useState(0);
    const [elm5DollarExpected, setElm5DollarExpected] = useState(0);
    const [elm10DollarExpected, setElm10DollarExpected] = useState(0);
    const [elm20DollarExpected, setElm20DollarExpected] = useState(0);
    const [elm50DollarExpected, setElm50DollarExpected] = useState(0);
    const [elm100DollarExpected, setElm100DollarExpected] = useState(0);
    const [elm1DollarCoinExpected, setElm1DollarCoinExpected] = useState(0);
    const [elm2DollarExpected, setElm2DollarExpected] = useState(0);
    const [elmHalfDollarCoinExpected, setElmHalfDollarCoinExpected] = useState(0);

    const colorChangeThreshold = 2;

    //calculates the total of all denominations with rounding
    const totalAmount = 
        Math.round(
            (
                (elmPennies * 0.01) + 
                (elmNickles * 0.05) +
                (elmDimes * 0.1) +
                (elmQuarters * 0.25) +
                (elmPenniesRolled * 0.5) +
                (elmNicklesRolled * 2) +
                (elmDimesRolled * 5) +
                (elmQuartersRolled * 10) +
                (elm1Dollar * 1) +
                (elm5Dollar * 5) +
                (elm10Dollar * 10) +
                (elm20Dollar * 20) +
                (elm50Dollar * 50) +
                (elm100Dollar * 100) +
                (elm1DollarCoin * 1) +
                (elm2Dollar * 2) +
                (elmHalfDollarCoin * 0.5)
            ) * 100
        ) / 100
    ;

    const [expectedAmount, setExpectedAmount] = useState(0);
    const [postSuccess, SetPostSuccess] = useState(null);
    const [possSuccessTxt, SetPosSuccessTxt] = useState("");

    //Stores the general styling for the actual/current total denominations text field.
    //here, we simply change the text & bg color based on if we're over, under, or at expected value
    //with a 2 dollar margin
    const actualAmountStyle = classNames(
        'box-border',
        'text-center',
        'mb-4',
        'ml-6',
        'mr-12',
        'w-24',
        'float-right',
        'border-border-color',
        'border-2',
        'bg-white',
        {
            'bg-yellow-200': totalAmount > expectedAmount + colorChangeThreshold,
            'text-yellow-600': totalAmount > expectedAmount + colorChangeThreshold,

            'bg-rose-300': totalAmount < expectedAmount - colorChangeThreshold,
            'text-rose-700': totalAmount < expectedAmount - colorChangeThreshold,

            'bg-green-300': totalAmount <= expectedAmount + colorChangeThreshold && totalAmount >= expectedAmount - colorChangeThreshold,
            'text-green-700': totalAmount <= expectedAmount + colorChangeThreshold && totalAmount >= expectedAmount - colorChangeThreshold,
        }
    );

    //keep values clamped between a minimum and maxium value
    function clamp(value, min = 0, max = 100000){
        if (value < min){
            return min;
        }else if (value > max){
            return max;
        }
        return value;
    }

    //call on component load AND when the currently-selected pos has refreshed
    useEffect(() => {
        console.log("setting pos array index to " + currentPosIndex + ", see below");
        console.log(poss[currentPosIndex]);

        //update the expected total amount
        GetExpectedCount();
    }, [currentPosIndex]);

    //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    //(also change arrow text thing)
    function ToggleExtraChange(){
        setShowExtraChange(!showExtraChange);
        if (!showExtraChange){
            setShowExtraChangeTxt("hide extras ▲");
        }else{
            setShowExtraChangeTxt("show extras ▼");
        }
    }

    //clears all the inpout fields to default values
    function ClearAllFields(){
        setElmPennies(0);
        setElmNickles(0);
        setElmDimes(0);
        setElmQuarters(0);
        setElmPenniesRolled(0);
        setElmNicklesRolled(0);
        setElmDimesRolled(0);
        setElmQuartersRolled(0);
        setElm1Dollar(0);
        setElm5Dollar(0);
        setElm10Dollar(0);
        setElm20Dollar(0);
        setElm50Dollar(0);
        setElm100Dollar(0);
        setElm1DollarCoin(0);
        setElm2Dollar(0);
        setElmHalfDollarCoin(0);
    }

    //call on component load AND when poss state has refreshed
    useEffect(() => {
        if (poss.length > 0){
            //update current pos
            SetCurrentPosIndex(0);
            SetPosHasLoaded(true);
        }
    }, [poss]);

    //call on component load AND when postSuccess is updated
    useEffect(() => {
        function Initialize(){
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStoreObjects?storeID=${auth.cookie.user.viewingStoreID}`)
            .then(response => {
                console.log(response);
                //set the pos information data
                setPoss(response.data);
                SetPostSuccess(false);
            })
            .catch(error => {
                console.error(error);
            });
        }

        Initialize();
    }, [postSuccess]);

    //gets the expected count for this pos
    function GetExpectedCount(){
        //wait until we have our pos data before attempting to execute
        if (poss.length > 0 && poss[currentPosIndex]){
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetOpenCount?storeID=${auth.cookie.user.viewingStoreID}&registerID=${poss[currentPosIndex].regID}`)
            .then(response => {
                //set the expected amount of the currently-selected pos
                console.log("getting cash count for " + poss[currentPosIndex].name + ", see below");
                console.log(response);
                setExpectedAmount(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
    
    //prevents the user from pressing enter on accident to submit on the form by disallowing the behavior altogether
    function PreventKeyDown(event){
        if (event.keyCode === 13){
            event.preventDefault();
        }
    }

    function Submit(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        //check if our currently-selected pos is open
        if (!poss[currentPosIndex].opened){
            axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount', {
                "storeID": auth.cookie.user.viewingStoreID,
                "usrID": auth.cookie.user.ID,
                "total": totalAmount,
                "type": "OPEN",
                "itemCounted": poss[currentPosIndex].name,
                "amountExpected": expectedAmount,
                "hundred": elm100Dollar,
                "fifty": elm50Dollar,
                "twenty": elm20Dollar,
                "ten": elm10Dollar,
                "five": elm5Dollar,
                "two": elm2Dollar,
                "one": elm1Dollar,
                "dollarCoin": elm1DollarCoin,
                "halfDollar": elmHalfDollarCoin,
                "quarter": elmQuarters,
                "dime": elmDimes,
                "nickel": elmNickles,
                "penny": elmPennies,
                "quarterRoll": elmQuartersRolled,
                "dimeRoll": elmDimesRolled,
                "nickelRoll": elmNicklesRolled,
                "pennyRoll": elmPenniesRolled
            })
            .then(response => {
                console.log(response);
                if (response.status == 200){
                    //open POS
                    SetPostSuccess(true);
                    toast.success(poss[currentPosIndex].name + " opened successfully!");
                }else{
                    //send toast saying that the pos could not be opened
                    SetPostSuccess(false);
                    toast.error("Error trying to open" + poss[currentPosIndex].name);
                }
            })
            .catch(error => {
                //uh oh, fucky wucky
                console.error(error);
                toast.error("Unknown error occured");
            });
        }else{
            //prevent users from opening an already-opened pos
            toast.error(poss[currentPosIndex].name + " is already open!");
        }
    }

    return (
        <div className="flex h-screen bg-custom-accent">
            <Toaster 
                richColors 
                position="bottom-right"
                expand={true}
                duration={5000}
                pauseWhenPageIsHidden={true}
            />
            <SideBar currentPage={1} />
            <div className="w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
                    <p className="text-2xl w-44 mb-2">Select a POS or Safe to open</p>
                    {posHasLoaded ? 
                        <>
                            {poss.map((item, index) => (
                                <>
                                    <label>
                                        <input 
                                            key={item.name} 
                                            defaultChecked={index === 0}
                                            onChange={(e) => SetCurrentPosIndex(index)} 
                                            disabled={item.opened || ((poss[0].opened ? false : true) && (index > 0))}
                                            type="radio" 
                                            name={"POS"} 
                                            value={item.name} 
                                        />
                                        {item.name} - {item.opened ? "Open" : "Closed"}
                                    </label>
                                    <br/>
                                </>
                            ))}
                        </>
                    : <p>Loading...</p>}
                </div>
                <div className="text-main-color float-left ml-16 mt-12">
                    {
                        posHasLoaded ? 
                        <p className="text-2xl" >Enter denominations for {poss[currentPosIndex].name}</p>
                        :
                        <p className="text-2xl" >Waiting for POS data...</p>
                    }
                    <hr/><br/>
                    <form onKeyDown={PreventKeyDown} onSubmit={Submit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="text-2xl">Bills</td>
                                    <td className="text-2xl">Expected</td>
                                    <td className="text-2xl">Actual</td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$100s</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm100DollarExpected} 
                                            //onChange={e => setElm100DollarExpected(clamp(e.target.value))}  
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm100Dollar} 
                                            onChange={e => setElm100Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$50s</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm50DollarExpected} 
                                            //onChange={e => setElm50DollarExpected(clamp(e.target.value))}  
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm50Dollar} 
                                            onChange={e => setElm50Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$20s</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm20DollarExpected}
                                            //onChange={e => setElm20DollarExpected(clamp(e.target.value))}
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm20Dollar} 
                                            onChange={e => setElm20Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$10s</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm10DollarExpected} 
                                            //onChange={e => setElm10DollarExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm10Dollar} 
                                            onChange={e => setElm10Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$5's</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm5DollarExpected}
                                            //onChange={e => setElm5DollarExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm5Dollar} 
                                            onChange={e => setElm5Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>$1's</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm1DollarExpected}
                                            //onChange={e => setElm1DollarExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm1Dollar} 
                                            onChange={e => setElm1Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <br/>
                                <tr>
                                    <td className="text-2xl">Coins</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Quarters (rolled)</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmQuartersRolledExpected}
                                            //onChange={e => setElmQuartersRolledExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmQuartersRolled} 
                                            onChange={e => setElmQuartersRolled(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Dimes (rolled)</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmDimesRolledExpected}
                                            //onChange={e => setElmDimesRolledExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmDimesRolled} 
                                            onChange={e => setElmDimesRolled(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Nickles (rolled)</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmNicklesRolledExpected}
                                            //onChange={e => setElmNicklesRolledExpected(clamp(e.target.value))}
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmNicklesRolled} 
                                            onChange={e => setElmNicklesRolled(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Pennies (rolled)</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmPenniesRolledExpected}
                                            //onChange={e => setElmPenniesRolledExpected(clamp(e.target.value))}  
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmPenniesRolled} 
                                            onChange={e => setElmPenniesRolled(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Quarters</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmQuartersExpected}
                                            //onChange={e => setElmQuartersExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmQuarters} 
                                            onChange={e => setElmQuarters(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Dimes</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmDimesExpected}
                                            //onChange={e => setElmDimesExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmDimes} 
                                            onChange={e => setElmDimes(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Nickles</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmNicklesExpected}
                                            //onChange={e => setElmNicklesExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmNickles} 
                                            onChange={e => setElmNickles(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Pennies</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmPenniesExpected}
                                            //onChange={e => setElmPenniesExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmPennies} 
                                            onChange={e => setElmPennies(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>
                                <br/>
                                {showExtraChange == true && <tr>
                                    <td className="text-2xl">Other</td>
                                    <td></td>
                                    <td></td>
                                </tr>}
                                {showExtraChange == true && <tr>
                                    <td>
                                        <label>$1 coin</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm1DollarCoinExpected}
                                            //onChange={e => setElm1DollarCoinExpected(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm1DollarCoin} 
                                            onChange={e => setElm1DollarCoin(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>}
                                {showExtraChange == true && <tr>
                                    <td>
                                        <label>$2's</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elm2DollarExpected}
                                            //onChange={e => setElm2DollarExpected(clamp(e.target.value))}  
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elm2Dollar} 
                                            onChange={e => setElm2Dollar(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>}
                                {showExtraChange == true &&<tr>
                                    <td>
                                        <label>$1/2 coin</label>
                                    </td>
                                    <td>
                                        <input 
                                            value={elmHalfDollarCoinExpected}
                                            //onChange={e => setElmHalfDollarCoinExpected(clamp(e.target.value))}  
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                            type="number"
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            value={elmHalfDollarCoin} 
                                            onChange={e => setElmHalfDollarCoin(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                    </td>
                                </tr>}
                                <tr>
                                    <td colSpan="3"><p className="cursor-pointer w-full mb-4 text-center hover:bg-nav-bg bg-white text-xl" onClick={ToggleExtraChange}>{showExtraChangeTxt}</p></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="submit" value="submit" min="0" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Open</button>
                                    </td>
                                    <td>
                                        <button onClick={ClearAllFields} type="button" value="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Clear all fields</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="text-main-color text-2xl float-left ml-16 mt-12">
                    <div>
                        <label> Current Total:
                            <input 
                                value={"$" + totalAmount}
                                className={actualAmountStyle}
                                type="text" 
                                disabled={true}
                            />
                        </label>
                    </div>
                    <br/>
                    <div>
                        <label> Expected Total:
                            <input 
                                value={"$" + expectedAmount}
                                disabled={true}
                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300" 
                                type="text" 
                            />
                        </label>
                    </div>
                    <div>
                        {/*postSuccess == true && <p className="text-base font-bold text-green-500">{possSuccessTxt}</p>*/}
                        {/*postSuccess == false && <p className="text-base font-bold text-red-500">{possSuccessTxt}</p>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenDayPage;
