import React, { useEffect, useState } from "react";
import './quotes.css'
import { useNavigate } from "react-router-dom";
const QuotesComponent: React.FC = () => {

    /** 
     * @type {string[]} Array of quotes 
     */
    let quoteContent: string[] = [
        "What we do repeatedly,\nlest it fall to chaos.",
        "Sow an act, reap habit.\nCultivate habit, harvest fate.",
        "Habit's chains are unseen threads,\nunbreakable bonds they become.",
        "Discipline is the soul's choice:\ngreatest good over fleeting want.",
        "The impediment to deed is the deed itself.\nWhat blocks the path, becomes the path.",
        "Govern your inner city,\nlest it fall to chaos.",
        "Declare first the man you would be.\nThen, perform the necessary tasks.",
        "Trials temper the spirit,\nas exertion sculpts the form.",
        "Power resides within your mind,\nnot in the world's turning. Know this.",
        "The sting of training is brief;\nthe wound of inaction festers.",
        "Steadfastness alone forges\nthe master's hand.",
        "Small disciplines, consistently woven,\nclothe the soul in great achievement.",
        "Speak not of your truth.\nLive it.",
        "The sole passage through suffering\nlies in confronting it.",
        "Habit is a stout rope;\neach dawn adds a strand.",
        "Command your own training,\ncommand your existence.",
        "The man without rigor\nis a slave to fleeting urges.",
        "Every practice and power is affirmed\nand grows through its corresponding action.",
        "Virtue is a settled disposition\nof the will's choosing.",
        "A life unexamined\nis a life half-lived.",
        "The greatest strength lies\nin a balanced soul.",
        "Cease debating the good man.\nBecome him, in action.",
        "Clinging to the external's whims\ndiminishes inner rule.",
        "Naught of greatness\nappears in an instant.",
        "Hone yourself in the small trials;\nthen advance to the large.",
        "True liberty is known not\nwithout a disciplined mind.",
        "The noblest conquest is that\nover one's own self.",
        "You mirror\nthat which you attend.",
        "It is in no man's power to have what he wants.\nYet, not desiring it is within one's power.",
        "The soul takes on the hue\nof its persistent thoughts.",
        "Flourishing is built\nwith deliberate, small steps.",
        "Man masters the world\nby mastering his own nature.",
        "No foe to understanding is greater\nthan self-deception.",
        "Good habits sown in youth's soil\nyield a different harvest.",
        "The wise seek not pleasure's grasp,\nbut freedom from pain's grip.",
        "We suffer more often in fearing\nthan in facing reality.",
        "If your deeds are virtuous,\nthen virtuous you are.",
        "Claim the dawn.\nVanquish the day.",
        "Focus on that which is yours to command.\nRelease the rest to the Fates.",
        "Suffer not from\nimagined ills.",
        "Accept fortune without pride.\nRelinquish it without sorrow.",
        "Recall: each sun sets on a life diminishing.\nLive, then, as if truly living.",
        "The only failed endeavor\nis that left unattempted.",
        "Discipline is the very soul\nof a formidable force.",
        "Know thy soul.\nMaster thy soul.",
        "Education's roots bite deep and bitter,\nbut its fruit is sweet wisdom.",
        "No greater realm shall you ever hold\nthan that within your own breast.",
        "To sway others is power;\nto sway oneself is true dominion.",
        "Adversity hardens\nthe thinking spirit.",
        "Command your practices,\nor be commanded by them.",
        "The morrow's bounty is bought\nwith today's coin of effort.",
        "Each sunrise offers\na fresh genesis.",
        "Await not the muse's call.\nEmbody the dedicated practice.",
        "Action is the first stone laid\non the path to achievement.",
        "Ease was the portion\nof the day gone by.",
        "Embrace the arduous toil.\nBuild an unyielding core.",
        "Your daily custom\nshapes your appointed end.",
        "What is done without fail each day holds more sway\nthan grand gestures performed rarely.",
        "Small strivings, consistently applied, bring forth\nresults of monumental scale.",
        "The bonds of habit are only felt\nwhen one strains to break them.",
        "Discipline spans the chasm\nbetween aspiration and attainment.",
        "By your habits\nshall your future be known.",
        "Cultivate the ways\nof the purposeful warrior.",
        "Improvement answers only\nto persistent effort.",
        "Let the sequence\nremain unbroken.",
        "Earn the coming day's favor\nwith today's exertion.",
        "The toll of self-mastery is light\ncompared to idleness's heavy burden.",
        "Be relentless in your striving\nfor a better self.",
        "The path of least resistance\nleads to a softened will.",
        "Forge your character's mettle\nthrough repeated, virtuous deeds.",
        "Your practices establish your measure.\nLet that measure be high.",
        "The body achieves what the mind believes,\ncemented by habit.",
        "Think not merely. Act.\nAct again and again.",
        "He who governs his customs\ngoverns his life's course.",
        "Every choice reinforces a road taken.\nChoose with prudence, choose always.",
        "The daily struggle is the ground\nwhere greatness is sown.",
        "Regularly perform\nthe tasks that challenge.",
        "Your routine is a sacred rite.\nApproach it with reverence.",
        "The difference lies in the small points,\ntended to each day.",
        "Discipline is the truest expression\nof regard for oneself.",
        "Build your habits brick by brick;\nerect an unbreachable fort.",
        "The adversary of resolved effort\nis soft comfort.",
        "Confront your ingrained ways,\nor they shall dominate you.",
        "The forge of the will\nis daily effort.",
        "That which you allow to persist\nbecomes your standard.",
        "The road to potency\nis paved with rigorous habit.",
        "Your enduring practices are\nyour most accurate reflection.",
        "Claim ownership of your deeds,\nclaim ownership of your tomorrows.",
        "The one who disciplines himself\nis truly unbound.",
        "Let your settled practices\nserve as your shield.",
        "The fervor of your habits dictates\nthe arc of your existence.",
        "Let no single setback\nundo a worthy practice.",
        "The cumulative force of habit\nis an irresistible tide.",
        "The bedrock of triumph\nis laid down day by day.",
        "Build your habits in stillness.\nLet the outcome announce itself.",
        "The tireless pursuit\nof minor advancements.",
        "The self of future days shall offer thanks\nfor the discipline shown today.",
        "The grand arena of being demands\nunrelenting daily exercise.",
        "Stern choices now, ease later.\nEase now, stern trials later.",
        "Be a servant to your settled ways,\nbut choose your master with sagacity."
    ]
    /** 
     * @type {string} Random quote selected to display 
     */
    const [randomQuote, setRandomQuote] = useState<string>('');
    /** 
     * @type {function} Navigate function for route redirection 
     */
    const navigate = useNavigate();

    /** 
     * Sets a random quote, logs it, and navigates to '/authenticate' after 1.5 seconds. 
     * Clears the timer on cleanup.
     */
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quoteContent.length);
        setRandomQuote(quoteContent[randomIndex]);
        const timer = setTimeout(() => {
            navigate('/authenticate');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="quote-content">
                <div className="quote-content">
                    <span className="large-quote">&ldquo;</span>
                    {randomQuote}
                    <span className="large-quote">&rdquo;</span>
                </div>
            </div>
        </>
    )
}

export default QuotesComponent;