import React, { useState,useEffect,useRef } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import ProjectDetail from "./ProjectDetail";
import { Divide } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useParams } from "react-router-dom";
import { useProject } from "@/contexts/project";



export const Project= () => {
  const {projectId}=useParams()
  const {project,fetchProject}=useProject()
  

  
    useEffect(()=>{
      const getProject = async () => {
        await fetchProject(projectId);
      };
      getProject()
    },[])
   
    
  return (
    <div className="h-screen w-full bg-[#18181B] text-neutral-50 overflow-scroll">
      <div className="px-4 pt-4">
      <ProjectDetail />
      </div>
      <Board />
    </div>
  );
};
 const COLUMN_DATA=[
  {title:"Backlog",column:"backlog",headingColor:"text-neutral-500"},
  {title:"TODO",column:"todo",headingColor:"text-yellow-200" },
  {title:"In progress",column:"doing",headingColor:"text-blue-200"},
  {title:"Complete", column:"done",headingColor:"text-emerald-200"},
  {title:"Complete", column:"done",headingColor:"text-emerald-200"},

  
 ]
const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [columns,setColumns]=useState(COLUMN_DATA)

  return (
    <div className="grid grid-cols-5 grid-flow-row h-full w-full gap-3 p-12">
      {columns.map((c)=>{
        
        return <><Column title={c.title}
        column={c.column}
        headingColor={c.headingColor}
        cards={cards}
        setCards={setCards}/>
        </>
      })}
      {columns.length>8 ?(""):(
      <AddColumn setColumns={setColumns}/>)}
      <BurnBarrel  setCards={setCards} setColumns={setColumns}  />
    
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();

    setActive(false);
    clearHighlights(indicators);

    
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    const indicators=getIndicators()
    clearHighlights(indicators);
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);
  const scrollRef=useRef(null)
  const [isAdding,setIsAdding]=useState(false)
  useEffect(() => {
    if (isAdding && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isAdding]);
  const handleColumnDragStart=(e,column)=>{
    e.dataTransfer.setData("column", column);
  }

  return (
    <div draggable="true" onDragStart={(e)=>handleColumnDragStart(e,column)} className="w-56 shrink-0 col-span-1">
  <div className="mb-3 flex items-center justify-between">
    <h3 className={`font-medium ${headingColor}`}>{title}</h3>
    <span className="rounded text-sm text-neutral-400">
      {filteredCards.length}
    </span>
  </div>

  {/* Scrollable Container with Padding */}
  <div  ref={scrollRef}  className="h-[400px]  overflow-auto p-2">
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`w-full transition-colors ${
        active ? "bg-neutral-800/50" : "bg-[#18181B]"
      } p-2`}  // Added padding inside the container
    >
      {filteredCards.map((c) => {
        return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
      })}
      <DropIndicator beforeId={null} column={column} />
      <AddCard setIsAdding={setIsAdding}  column={column} setCards={setCards} />
    </div>
  </div>
</div>

  
  );
};

const Card = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-[#27272A] p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards,setColumns }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    if(e.dataTransfer.getData("cardId")){
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    }
    else{
      const columnId=e.dataTransfer.getData("column")
      setCards((pv)=>pv.filter((c)=>c.column!==columnId))
      setColumns((pv)=>pv.filter((c)=>c.column!==columnId))
    }

    

    

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 row-span-full shrink-0 place-content-center rounded border text-3xl col-start-5  col-span-1  ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards, setIsAdding }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setAdding(false);
    setIsAdding(false); // Reset isAdding after adding a card
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                setAdding(false);
                setIsAdding(false);
              }}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => {
            setAdding(true);
            setIsAdding(true); // Notify Column that "adding" has started
          }}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

const AddColumn = ({ setColumns }) => {
  const [text, setText] = useState("");
  const [headingColor, setHeadingColor] = useState("");
  const [adding, setAdding] = useState(false);
  
  // Color mapping from hex to Tailwind class names
  const colors = [
    { hex: "#01B8AA", name: "Teal", class: "text-teal-400" },
    { hex: "#FE9666", name: "Coral", class: "text-orange-300" },
    { hex: "#8AD4EB", name: "Light Blue", class: "text-blue-200" },
    { hex: "#F2C80F", name: "Gold", class: "text-yellow-200" },
    { hex: "#6A5ACD", name: "Slate Blue", class: "text-indigo-400" },
    { hex: "#FF6B6B", name: "Pastel Red", class: "text-red-300" },
    { hex: "#4BC0C0", name: "Teal", class: "text-teal-300" },
    { hex: "#9ACD32", name: "Yellow Green", class: "text-lime-300" },
    { hex: "#FF85EA", name: "Pink", class: "text-pink-300" },
    { hex: "#36D7B7", name: "Mint", class: "text-emerald-300" },
    { hex: "#FFA07A", name: "Light Salmon", class: "text-orange-200" },
    { hex: "#C71585", name: "Medium Violet Red", class: "text-fuchsia-500" },
    { hex: "#20B2AA", name: "Light Sea Green", class: "text-emerald-400" },
    { hex: "#FFD700", name: "Gold", class: "text-amber-300" }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim().length) return;
    
    const columnId = text.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Use the selected color's class name instead of the hex value
    const selectedColor = colors.find(color => color.hex === headingColor);
    const colorClass = selectedColor ? selectedColor.class : "text-neutral-50";
    
    const newColumn = {
      title: text.trim(),
      column: columnId,
      headingColor: colorClass  // Using class name instead of hex color
    };
    
    setColumns((pv) => [...pv, newColumn]);
    setAdding(false);
    setText("");
    setHeadingColor("");
  };

  // Get current textbox style based on selected color
  const getTextStyle = () => {
    if (!headingColor) return {};
    return { color: headingColor };
  };
  
  return (
    <>
      {adding ? (
        <motion.form onSubmit={handleSubmit} layout className="w-56 bg-neutral-800/50 p-3 rounded">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="Add new column..."
              className="w-full h-12 rounded border border-violet-400 bg-violet-400/20 p-3 text-sm placeholder-violet-300 focus:outline-0"
              style={getTextStyle()}
            />
            {!text && (
              <div className="absolute top-3 left-3 text-sm pointer-events-none">
                <span className="text-violet-300">Add new column...</span>
              </div>
            )}
          </div>
          
          <div className="w-full mt-3">
            <div className="relative w-full h-8 flex rounded-md overflow-hidden shadow-lg mb-3">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setHeadingColor(color.hex)}
                  className="h-full flex-1 transition-all duration-300 ease-in-out hover:scale-110 hover:z-10 cursor-pointer relative"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {headingColor === color.hex && (
                    <div className="absolute inset-0 border-2 border-white opacity-70"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setText("");
                setHeadingColor("");
              }}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full justify-center items-center text-xs text-neutral-400 transition-colors bg-neutral-800/50 hover:text-neutral-50 hover:bg-neutral-800 p-2 rounded"
        >
          <FiPlus className="h-5 w-5 hover:w-6 hover:h-6" />
        </motion.button>
      )}
    </>
  );
};
const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];