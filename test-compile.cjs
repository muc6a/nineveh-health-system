var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// test-compile.jsx
var import_react6 = __toESM(require("react"), 1);
var import_server = require("react-dom/server");

// src/pages/SuperAdminPanel.jsx
var import_react5 = __toESM(require("react"), 1);

// src/context/AppContext.jsx
var import_react = __toESM(require("react"), 1);
var AppContext = (0, import_react.createContext)();
var DEFAULT_PERMISSIONS2 = {
  manageEstablishments: false,
  createEst: false,
  editEst: false,
  deleteEst: false,
  addEval: false,
  showMainDashboard: false,
  showReportsPage: false,
  showDirectivesPage: false,
  showDeliveryPage: false,
  showPublicEvalsPage: false,
  sendDirective: false,
  replyDirective: false
};
var INITIAL_TEAMS = [
  {
    id: "team_1",
    name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646",
    sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646",
    email: "team1@ninveh.health.gov.iq",
    phone: "07700011122",
    username: "team1",
    password: "password123",
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS2 },
    members: {
      doctors: ["\u062F. \u0623\u062D\u0645\u062F \u0635\u0627\u0644\u062D \u0627\u0644\u062C\u0628\u0648\u0631\u064A"],
      assistants: ["\u0645\u0633\u0627\u0639\u062F \u0639\u0644\u064A \u0627\u0644\u0628\u0643\u0631\u064A"],
      technicians: ["\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A \u0639\u0645\u0631 \u0627\u0644\u0645\u0635\u0644\u064A"]
    }
  },
  {
    id: "team_2",
    name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629 - \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0632\u0647\u0648\u0631",
    sector: "\u0627\u0644\u0632\u0647\u0648\u0631",
    email: "team2@ninveh.health.gov.iq",
    phone: "07700022233",
    username: "team2",
    password: "password123",
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS2 },
    members: {
      doctors: ["\u062F. \u0632\u064A\u0627\u062F \u0637\u0627\u0631\u0642 \u0627\u0644\u062D\u064A\u0627\u0644\u064A"],
      assistants: ["\u0645\u0633\u0627\u0639\u062F \u0641\u0647\u062F \u0645\u062D\u0645\u0648\u062F"],
      technicians: ["\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A \u064A\u0648\u0633\u0641 \u064A\u0648\u0646\u0633"]
    }
  },
  {
    id: "team_3",
    name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629 - \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0645\u0635\u0627\u0631\u0641",
    sector: "\u0627\u0644\u0645\u0635\u0627\u0631\u0641",
    email: "team3@ninveh.health.gov.iq",
    phone: "07700033344",
    username: "team3",
    password: "password123",
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS2 },
    members: {
      doctors: ["\u062F. \u0644\u0624\u064A \u064A\u062D\u064A\u0649 \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A"],
      assistants: ["\u0645\u0633\u0627\u0639\u062F \u062C\u0627\u0633\u0645 \u0645\u062D\u0645\u062F"],
      technicians: ["\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A \u0645\u0647\u0646\u062F \u062E\u0627\u0644\u062F"]
    }
  },
  {
    id: "team_4",
    name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0631\u0627\u0628\u0639\u0629 - \u062D\u064A \u0627\u0644\u063A\u0632\u0644\u0627\u0646\u064A",
    sector: "\u0627\u0644\u063A\u0632\u0644\u0627\u0646\u064A",
    email: "team4@ninveh.health.gov.iq",
    phone: "07700044455",
    username: "team4",
    password: "password123",
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS2 },
    members: {
      doctors: ["\u062F. \u064A\u0627\u0633\u0631 \u0623\u062D\u0645\u062F \u0627\u0644\u0645\u0648\u0635\u0644\u064A"],
      assistants: ["\u0645\u0633\u0627\u0639\u062F \u0639\u0644\u0627\u0621 \u062D\u0633\u064A\u0646"],
      technicians: ["\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A \u0631\u0627\u0626\u062F \u0635\u0644\u0627\u062D"]
    }
  }
];

// src/components/AnimatedLogo.jsx
var import_react2 = __toESM(require("react"), 1);
var AnimatedLogo = ({ variant = "default", className = "" }) => {
  const baseVideoPath = "/logo-animated.mp4";
  if (variant === "login") {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: `relative flex flex-col items-center justify-center ${className}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute w-64 h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" }), /* @__PURE__ */ import_react2.default.createElement(
      "video",
      {
        src: baseVideoPath,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        className: "w-48 h-48 md:w-56 md:h-56 object-contain z-10 drop-shadow-[0_15px_15px_rgba(13,148,136,0.2)] transition-transform duration-500 hover:scale-105 mix-blend-multiply dark:invert dark:mix-blend-screen"
      }
    ));
  }
  if (variant === "sidebar") {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: `flex items-center gap-3 p-4 border-b border-white/10 ${className}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative w-12 h-12 bg-white/10 dark:bg-slate-900/30 rounded-xl overflow-hidden border border-white/20 shadow-inner" }, /* @__PURE__ */ import_react2.default.createElement(
      "video",
      {
        src: baseVideoPath,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        className: "w-full h-full object-cover scale-110 mix-blend-multiply dark:invert dark:mix-blend-screen"
      }
    )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-sm font-bold text-slate-800 dark:text-white leading-tight" }, "\u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629"), /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-[10px] text-slate-500 dark:text-slate-400" }, "\u0645\u062D\u0627\u0641\u0638\u0629 \u0646\u064A\u0646\u0648\u0649")));
  }
  if (variant === "seal") {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: `relative flex flex-col items-center justify-center ${className}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl animate-ping opacity-30" }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative p-2.5 rounded-full bg-gradient-to-tr from-emerald-600/30 to-teal-500/10 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(13,148,136,0.4)] animate-pulse" }, /* @__PURE__ */ import_react2.default.createElement(
      "video",
      {
        src: baseVideoPath,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        className: "w-24 h-24 object-contain rounded-full bg-slate-900/10 dark:bg-slate-950/20 mix-blend-multiply dark:invert dark:mix-blend-screen"
      }
    )));
  }
  return /* @__PURE__ */ import_react2.default.createElement(
    "video",
    {
      src: baseVideoPath,
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      className: `w-20 h-20 object-contain mix-blend-multiply dark:invert dark:mix-blend-screen ${className}`
    }
  );
};

// src/components/ThemeToggle.jsx
var import_react3 = __toESM(require("react"), 1);
var import_lucide_react = require("lucide-react");
var ThemeToggle = () => {
  const { darkMode, setDarkMode } = (0, import_react3.useContext)(AppContext);
  return /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      onClick: () => setDarkMode(!darkMode),
      className: "relative flex items-center justify-center p-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-3d-inset hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-700/60 active:scale-95 transition-all duration-300",
      "aria-label": "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0638\u0647\u0631",
      title: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0638\u0647\u0631"
    },
    /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative w-6 h-6" }, /* @__PURE__ */ import_react3.default.createElement(import_lucide_react.Sun, { className: `absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 transform ${darkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}` }), /* @__PURE__ */ import_react3.default.createElement(import_lucide_react.Moon, { className: `absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-500 transform ${darkMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}` }))
  );
};

// src/pages/SuperAdminPanel.jsx
var import_lucide_react3 = require("lucide-react");

// src/components/AccountModal.jsx
var import_react4 = __toESM(require("react"), 1);
var import_lucide_react2 = require("lucide-react");

// src/utils/constants.js
var ROLES_DICTIONARY = [
  { id: "director_general", label: "\u0645\u062F\u064A\u0631 \u0639\u0627\u0645 \u062F\u0627\u0626\u0631\u0629 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0644\u064A\u0627" },
  { id: "deputy_director_general", label: "\u0645\u0639\u0627\u0648\u0646 \u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0641\u0646\u064A\u0629", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0644\u064A\u0627" },
  { id: "public_health_director", label: "\u0645\u062F\u064A\u0631 \u0642\u0633\u0645 \u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0648\u0633\u0637\u0649" },
  { id: "deputy_public_health_director", label: "\u0645\u0639\u0627\u0648\u0646 \u0645\u062F\u064A\u0631 \u0627\u0644\u0642\u0633\u0645", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0648\u0633\u0637\u0649" },
  { id: "central_health_sector_director", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064A\u0629", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0648\u0633\u0637\u0649" },
  { id: "right_bank_sector_director", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 : \u062C\u0627\u0646\u0628 \u0627\u0644\u0627\u064A\u0645\u0646", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" },
  { id: "left_bank_sector_director", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 : \u062C\u0627\u0646\u0628 \u0627\u0644\u0627\u064A\u0633\u0631", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" },
  { id: "district_sector_director_talafar", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 \u0641\u064A \u062A\u0644\u0639\u0641\u0631", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" },
  { id: "district_sector_director_sinjar", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 \u0641\u064A \u0633\u0646\u062C\u0627\u0631", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" },
  { id: "district_sector_director_hamdaniya", label: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 \u0641\u064A \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A\u0629", category: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" },
  { id: "field_team_leader", label: "\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0631\u0642\u0627\u0628\u064A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A", category: "\u0627\u0644\u0643\u0648\u0627\u062F\u0631 \u0627\u0644\u0641\u0646\u064A\u0629" },
  { id: "field_team_member", label: "\u0639\u0636\u0648 \u0644\u062C\u0646\u0629 \u0631\u0642\u0627\u0628\u064A\u0629", category: "\u0627\u0644\u0643\u0648\u0627\u062F\u0631 \u0627\u0644\u0641\u0646\u064A\u0629" },
  { id: "specialized_health_inspector", label: "\u0645\u0641\u062A\u0634 \u0635\u062D\u064A \u0645\u062A\u062E\u0635\u0635", category: "\u0627\u0644\u0643\u0648\u0627\u062F\u0631 \u0627\u0644\u0641\u0646\u064A\u0629" },
  { id: "food_quality_controller", label: "\u0645\u0631\u0627\u0642\u0628 \u062C\u0648\u062F\u0629 \u0627\u0644\u0623\u063A\u0630\u064A\u0629", category: "\u0627\u0644\u0643\u0648\u0627\u062F\u0631 \u0627\u0644\u0641\u0646\u064A\u0629" }
];
var NINEVEH_GEOGRAPHY = {
  mosul: {
    label: "\u0642\u0636\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0644 (\u0627\u0644\u0645\u0631\u0643\u0632)",
    sides: {
      right: {
        label: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646",
        neighborhoods: [
          "\u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629",
          "\u0628\u0627\u0628 \u0627\u0644\u0628\u064A\u0636",
          "\u0628\u0627\u0628 \u0627\u0644\u0637\u0648\u0628",
          "\u0627\u0644\u0645\u064A\u062F\u0627\u0646",
          "\u0631\u0623\u0633 \u0627\u0644\u0643\u0648\u0631",
          "\u0627\u0644\u0634\u0641\u0627\u0621",
          "\u0627\u0644\u0641\u0627\u0631\u0648\u0642",
          "\u0627\u0644\u062F\u0648\u0627\u0633\u0629",
          "\u0627\u0644\u0646\u0628\u064A \u0634\u064A\u062A",
          "\u0627\u0644\u0637\u064A\u0631\u0627\u0646",
          "\u0627\u0644\u062C\u0648\u0633\u0642",
          "\u0627\u0644\u064A\u0631\u0645\u0648\u0643",
          "\u0648\u0627\u062F\u064A \u062D\u062C\u0631",
          "\u0645\u0634\u064A\u0631\u0641\u0629",
          "\u062A\u0645\u0648\u0632",
          "\u0627\u0644\u0625\u0635\u0644\u0627\u062D \u0627\u0644\u0632\u0631\u0627\u0639\u064A",
          "\u0627\u0644\u0639\u0631\u064A\u0628\u064A"
        ]
      },
      left: {
        label: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631",
        neighborhoods: [
          "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629",
          "\u062D\u064A \u0627\u0644\u0632\u0647\u0648\u0631",
          "\u0627\u0644\u0645\u0635\u0627\u0631\u0641",
          "\u0627\u0644\u0645\u062B\u0646\u0649",
          "\u0627\u0644\u0628\u0631\u064A\u062F",
          "\u0627\u0644\u0645\u0647\u0646\u062F\u0633\u064A\u0646",
          "\u0627\u0644\u0641\u0644\u0627\u062D",
          "\u0627\u0644\u0646\u0648\u0631",
          "\u062D\u064A \u0627\u0644\u0634\u0631\u0637\u0629",
          "\u0627\u0644\u0643\u0641\u0627\u0621\u0627\u062A",
          "\u0627\u0644\u062C\u0627\u0645\u0639\u0629",
          "\u062D\u064A \u0627\u0644\u0639\u0631\u0628\u064A",
          "\u062D\u064A \u0627\u0644\u0636\u0628\u0627\u0637",
          "\u0627\u0644\u0633\u0643\u0631",
          "\u0627\u0644\u0628\u0644\u062F\u064A\u0627\u062A"
        ]
      }
    }
  },
  districts: [
    {
      id: "hamdaniya",
      label: "\u0642\u0636\u0627\u0621 \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A\u0629",
      subdistricts: ["\u0628\u062E\u062F\u064A\u062F\u0627", "\u0628\u0631\u0637\u0644\u0629", "\u0627\u0644\u0646\u0645\u0631\u0648\u062F", "\u0643\u0631\u0645\u0644\u064A\u0633", "\u0637\u0647\u0631\u0627\u0648\u0647"]
    },
    {
      id: "talafar",
      label: "\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632", "\u0627\u0644\u0639\u064A\u0627\u0636\u064A\u0629", "\u0632\u0645\u0627\u0631", "\u0631\u0628\u064A\u0639\u0629"]
    },
    {
      id: "shikhan",
      label: "\u0642\u0636\u0627\u0621 \u0627\u0644\u0634\u064A\u062E\u0627\u0646",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632", "\u0628\u0639\u0634\u064A\u0642\u0629"]
    },
    {
      id: "sinjar",
      label: "\u0642\u0636\u0627\u0621 \u0633\u0646\u062C\u0627\u0631",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632", "\u0627\u0644\u0634\u0645\u0627\u0644 (\u0633\u0646\u0648\u0646\u064A)", "\u0627\u0644\u0642\u062D\u0637\u0627\u0646\u064A\u0629"]
    },
    {
      id: "makhmour",
      label: "\u0642\u0636\u0627\u0621 \u0645\u062E\u0645\u0648\u0631",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632", "\u0627\u0644\u0643\u0648\u064A\u0631", "\u0642\u0631\u0627\u062C"]
    },
    {
      id: "aqra",
      label: "\u0642\u0636\u0627\u0621 \u0639\u0642\u0631\u0629",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632", "\u0628\u0631\u062F\u0631\u0634"]
    },
    {
      id: "hadhar",
      label: "\u0642\u0636\u0627\u0621 \u0627\u0644\u062D\u0636\u0631",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632"]
    },
    {
      id: "baaj",
      label: "\u0642\u0636\u0627\u0621 \u0627\u0644\u0628\u0639\u0627\u062C",
      subdistricts: ["\u0627\u0644\u0645\u0631\u0643\u0632"]
    }
  ]
};

// src/components/AccountModal.jsx
var AccountModal = ({ isOpen, onClose, initialData, onSave, mode = "add" }) => {
  const [name, setName] = (0, import_react4.useState)("");
  const [email, setEmail] = (0, import_react4.useState)("");
  const [phone, setPhone] = (0, import_react4.useState)("");
  const [username, setUsername] = (0, import_react4.useState)("");
  const [password, setPassword] = (0, import_react4.useState)("");
  const [showPassword, setShowPassword] = (0, import_react4.useState)(false);
  const [selectedRoleId, setSelectedRoleId] = (0, import_react4.useState)("");
  const [sectorType, setSectorType] = (0, import_react4.useState)("mosul");
  const [mosulSide, setMosulSide] = (0, import_react4.useState)("right");
  const [mosulNeighborhood, setMosulNeighborhood] = (0, import_react4.useState)("");
  const [districtId, setDistrictId] = (0, import_react4.useState)("");
  const [subdistrict, setSubdistrict] = (0, import_react4.useState)("");
  const [doctors, setDoctors] = (0, import_react4.useState)([""]);
  const [assistants, setAssistants] = (0, import_react4.useState)([""]);
  const [technicians, setTechnicians] = (0, import_react4.useState)([""]);
  (0, import_react4.useEffect)(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setEmail(initialData.email || "");
        setPhone(initialData.phone || "");
        setUsername(initialData.username || "");
        setPassword("");
        if (initialData.members) {
          setSelectedRoleId("field_team_leader");
          setDoctors(initialData.members.doctors?.length ? initialData.members.doctors : [""]);
          setAssistants(initialData.members.assistants?.length ? initialData.members.assistants : [""]);
          setTechnicians(initialData.members.technicians?.length ? initialData.members.technicians : [""]);
        } else {
          const matched = ROLES_DICTIONARY.find((r) => r.label === initialData.title || r.id === initialData.role);
          setSelectedRoleId(matched ? matched.id : ROLES_DICTIONARY[0].id);
        }
      } else {
        setName("");
        setEmail("");
        setPhone("");
        setUsername("");
        setPassword("");
        setSelectedRoleId(ROLES_DICTIONARY[0].id);
        setDoctors([""]);
        setAssistants([""]);
        setTechnicians([""]);
        setSectorType("mosul");
        setMosulSide("right");
        setMosulNeighborhood("");
        setDistrictId("");
        setSubdistrict("");
      }
    }
  }, [isOpen, initialData]);
  if (!isOpen) return null;
  const isFieldTeam = () => {
    const role = ROLES_DICTIONARY.find((r) => r.id === selectedRoleId);
    return role?.category === "\u0627\u0644\u0643\u0648\u0627\u062F\u0631 \u0627\u0644\u0641\u0646\u064A\u0629";
  };
  const handleArrayChange = (setter, array, index, value) => {
    const newArr = [...array];
    newArr[index] = value;
    setter(newArr);
  };
  const addField = (setter, array) => {
    setter([...array, ""]);
  };
  const removeField = (setter, array, index) => {
    if (array.length > 1) {
      const newArr = [...array];
      newArr.splice(index, 1);
      setter(newArr);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add" && !password) {
      alert("\u064A\u0631\u062C\u0649 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0644\u0644\u062D\u0633\u0627\u0628.");
      return;
    }
    let calculatedSector = "";
    if (isFieldTeam()) {
      if (sectorType === "mosul") {
        calculatedSector = `${mosulSide === "right" ? "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646" : "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631"} - ${mosulNeighborhood}`;
      } else {
        const district = NINEVEH_GEOGRAPHY.districts.find((d) => d.id === districtId);
        calculatedSector = `${district?.label || ""} - ${subdistrict}`;
      }
    }
    const roleData = ROLES_DICTIONARY.find((r) => r.id === selectedRoleId);
    const result = {
      ...initialData,
      name,
      email,
      phone,
      username,
      title: roleData?.label,
      role: roleData?.id,
      isTeam: isFieldTeam(),
      active: true
    };
    if (password) {
      result.password = password;
    }
    if (isFieldTeam()) {
      result.sector = calculatedSector;
      result.members = {
        doctors: doctors.filter((d) => d.trim() !== ""),
        assistants: assistants.filter((a) => a.trim() !== ""),
        technicians: technicians.filter((t) => t.trim() !== "")
      };
    }
    onSave(result);
  };
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-full max-w-2xl bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-6" }, /* @__PURE__ */ import_react4.default.createElement("h3", { className: "text-lg font-black text-teal-400" }, mode === "add" ? "\u2728 \u0625\u0636\u0627\u0641\u0629 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F" : "\u{1F4DD} \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react4.default.createElement("button", { onClick: onClose, className: "p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer" }, /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.X, { className: "w-5 h-5" }))), /* @__PURE__ */ import_react4.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-6 text-sm font-bold text-right" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A / \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629"), /* @__PURE__ */ import_react4.default.createElement(
    "select",
    {
      value: selectedRoleId,
      onChange: (e) => setSelectedRoleId(e.target.value),
      className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors"
    },
    ROLES_DICTIONARY.map((role) => /* @__PURE__ */ import_react4.default.createElement("option", { key: role.id, value: role.id }, role.label, " (", role.category, ")"))
  )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644"), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: name,
      onChange: (e) => setName(e.target.value),
      placeholder: "\u0645\u062B\u0627\u0644: \u062F. \u0623\u062D\u0645\u062F \u0635\u0627\u0644\u062D \u0627\u0644\u062C\u0628\u0648\u0631\u064A",
      className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors"
    }
  )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 (Username)"), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: username,
      onChange: (e) => setUsername(e.target.value),
      placeholder: "\u0645\u062B\u0627\u0644: ahmed_s",
      dir: "ltr",
      className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors text-left"
    }
  )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: "email",
      required: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "email@ninveh.health.gov.iq",
      dir: "ltr",
      className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors text-left"
    }
  )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0641\u0639\u0627\u0644"), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: "tel",
      required: true,
      value: phone,
      onChange: (e) => setPhone(e.target.value),
      placeholder: "077XXXXXXXX",
      dir: "ltr",
      className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors text-left"
    }
  ))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-300 block" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0634\u0641\u0631\u0629 \u0644\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      placeholder: mode === "edit" ? "\u0627\u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      dir: "ltr",
      className: "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white outline-none focus:border-teal-500 transition-colors text-left"
    }
  ), /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPassword(!showPassword),
      className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
    },
    showPassword ? /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.Eye, { className: "w-5 h-5" })
  ))), isFieldTeam() && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-6 pt-6 border-t border-slate-800 space-y-6" }, /* @__PURE__ */ import_react4.default.createElement("h4", { className: "text-teal-400 font-black text-sm flex items-center gap-2" }, /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.MapPin, { className: "w-4 h-4" }), " \u0627\u0644\u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A \u0648\u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0630\u0643\u064A (Geo-Mapping)"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "flex items-center gap-2 text-slate-300 cursor-pointer" }, /* @__PURE__ */ import_react4.default.createElement("input", { type: "radio", name: "sectorType", value: "mosul", checked: sectorType === "mosul", onChange: (e) => setSectorType(e.target.value), className: "accent-teal-500 w-4 h-4" }), "\u0642\u0636\u0627\u0621 \u0627\u0644\u0645\u0648\u0635\u0644 (\u0627\u0644\u0645\u0631\u0643\u0632)"), /* @__PURE__ */ import_react4.default.createElement("label", { className: "flex items-center gap-2 text-slate-300 cursor-pointer" }, /* @__PURE__ */ import_react4.default.createElement("input", { type: "radio", name: "sectorType", value: "district", checked: sectorType === "district", onChange: (e) => setSectorType(e.target.value), className: "accent-teal-500 w-4 h-4" }), "\u0627\u0644\u0623\u0642\u0636\u064A\u0629 \u0648\u0627\u0644\u0646\u0648\u0627\u062D\u064A")), sectorType === "mosul" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react4.default.createElement("select", { value: mosulSide, onChange: (e) => setMosulSide(e.target.value), className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white" }, /* @__PURE__ */ import_react4.default.createElement("option", { value: "right" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646"), /* @__PURE__ */ import_react4.default.createElement("option", { value: "left" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631")), /* @__PURE__ */ import_react4.default.createElement("select", { value: mosulNeighborhood, onChange: (e) => setMosulNeighborhood(e.target.value), className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white", required: isFieldTeam() }, /* @__PURE__ */ import_react4.default.createElement("option", { value: "" }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u062D\u064A \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A"), NINEVEH_GEOGRAPHY.mosul.sides[mosulSide].neighborhoods.map((hood) => /* @__PURE__ */ import_react4.default.createElement("option", { key: hood, value: hood }, hood)))) : /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react4.default.createElement("select", { value: districtId, onChange: (e) => {
    setDistrictId(e.target.value);
    setSubdistrict("");
  }, className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white", required: isFieldTeam() }, /* @__PURE__ */ import_react4.default.createElement("option", { value: "" }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0636\u0627\u0621"), NINEVEH_GEOGRAPHY.districts.map((d) => /* @__PURE__ */ import_react4.default.createElement("option", { key: d.id, value: d.id }, d.label))), /* @__PURE__ */ import_react4.default.createElement("select", { value: subdistrict, onChange: (e) => setSubdistrict(e.target.value), className: "w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white", required: isFieldTeam(), disabled: !districtId }, /* @__PURE__ */ import_react4.default.createElement("option", { value: "" }, "\u0627\u0644\u0646\u0627\u062D\u064A\u0629 / \u0627\u0644\u0645\u0631\u0643\u0632"), districtId && NINEVEH_GEOGRAPHY.districts.find((d) => d.id === districtId)?.subdistricts.map((sub) => /* @__PURE__ */ import_react4.default.createElement("option", { key: sub, value: sub }, sub)))), /* @__PURE__ */ import_react4.default.createElement("h4", { className: "text-teal-400 font-black text-sm flex items-center gap-2 mt-4" }, /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.Users, { className: "w-4 h-4" }), " \u0647\u064A\u0643\u0644\u064A\u0629 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0631\u0642\u0627\u0628\u064A"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("label", { className: "text-slate-400 block mb-2" }, "\u0627\u0644\u0623\u0637\u0628\u0627\u0621 \u0648\u0627\u0644\u0645\u0641\u062A\u0634\u0648\u0646 \u0627\u0644\u0635\u062D\u064A\u0648\u0646"), doctors.map((doc, idx) => /* @__PURE__ */ import_react4.default.createElement("div", { key: idx, className: "flex gap-2 mb-2" }, /* @__PURE__ */ import_react4.default.createElement("input", { type: "text", value: doc, onChange: (e) => handleArrayChange(setDoctors, doctors, idx, e.target.value), placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0641\u062A\u0634", className: "flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white" }), doctors.length > 1 && /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", onClick: () => removeField(setDoctors, doctors, idx), className: "p-2 text-red-400 hover:bg-red-500/10 rounded-lg" }, /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.Trash2, { className: "w-4 h-4" })))), /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", onClick: () => addField(setDoctors, doctors), className: "text-xs text-teal-400 flex items-center gap-1 mt-1" }, /* @__PURE__ */ import_react4.default.createElement(import_lucide_react2.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u0639\u0636\u0648")))), /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-4 rounded-xl bg-gradient-to-l from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm transition-all cursor-pointer mt-6 shadow-lg shadow-teal-500/20"
    },
    "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629"
  ))));
};

// src/pages/SuperAdminPanel.jsx
var SuperAdminPanel = () => {
  const { navigate, teams, setTeams, inspectionItems, setInspectionItems, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, publicCMS, setPublicCMS } = (0, import_react5.useContext)(AppContext);
  const [activeTab, setActiveTab] = (0, import_react5.useState)("roster");
  const [accountModalState, setAccountModalState] = (0, import_react5.useState)({ isOpen: false, mode: "add", data: null });
  const [showPermissionsModal, setShowPermissionsModal] = (0, import_react5.useState)(false);
  const [selectedPermissionsAccount, setSelectedPermissionsAccount] = (0, import_react5.useState)(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = (0, import_react5.useState)(null);
  const [step, setStep] = (0, import_react5.useState)(1);
  const [newTeamName, setNewTeamName] = (0, import_react5.useState)("");
  const [newTeamSector, setNewTeamSector] = (0, import_react5.useState)("\u0627\u0644\u0632\u0647\u0648\u0631");
  const [newTeamEmail, setNewTeamEmail] = (0, import_react5.useState)("");
  const [newTeamPhone, setNewTeamPhone] = (0, import_react5.useState)("");
  const [newTeamPass, setNewTeamPass] = (0, import_react5.useState)("");
  const [generalScope, setGeneralScope] = (0, import_react5.useState)("mosul");
  const [mosulSide, setMosulSide] = (0, import_react5.useState)("left");
  const [mosulNeighborhood, setMosulNeighborhood] = (0, import_react5.useState)("\u0627\u0644\u0632\u0647\u0648\u0631");
  const [districtName, setDistrictName] = (0, import_react5.useState)("\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631");
  const [districtSubsector, setDistrictSubsector] = (0, import_react5.useState)("\u0645\u0631\u0643\u0632 \u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631");
  const [doctors, setDoctors] = (0, import_react5.useState)([""]);
  const [assistants, setAssistants] = (0, import_react5.useState)([""]);
  const [technicians, setTechnicians] = (0, import_react5.useState)([""]);
  const [editingTeam, setEditingTeam] = (0, import_react5.useState)(null);
  const [editDoctors, setEditDoctors] = (0, import_react5.useState)([""]);
  const [editAssistants, setEditAssistants] = (0, import_react5.useState)([""]);
  const [editTechnicians, setEditTechnicians] = (0, import_react5.useState)([""]);
  const [subRosterTab, setSubRosterTab] = (0, import_react5.useState)("committees");
  const [subSettingsTab, setSubSettingsTab] = (0, import_react5.useState)("evaluations");
  const [subAuditTab, setSubAuditTab] = (0, import_react5.useState)("trail");
  const [showNewTeamPass, setShowNewTeamPass] = (0, import_react5.useState)(false);
  const [showEditTeamPass, setShowEditTeamPass] = (0, import_react5.useState)(false);
  const [showNewDirPass, setShowNewDirPass] = (0, import_react5.useState)(false);
  const [permsViewEsts, setPermsViewEsts] = (0, import_react5.useState)(true);
  const [permsEditEsts, setPermsEditEsts] = (0, import_react5.useState)(true);
  const [permsReportViolations, setPermsReportViolations] = (0, import_react5.useState)(true);
  const [permsViewCoverage, setPermsViewCoverage] = (0, import_react5.useState)(true);
  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    if (selectedPermissionsAccount.role === "team") {
      setTeams((prev) => prev.map((t) => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else {
      setDirectors((prev) => prev.map((d) => d.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : d));
    }
    triggerAlert(`\u062A\u0645 \u062D\u0641\u0638 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0623\u0630\u0648\u0646\u0627\u062A \u0644\u062D\u0633\u0627\u0628 (${selectedPermissionsAccount.name}) \u0628\u0646\u062C\u0627\u062D.`);
    setShowPermissionsModal(false);
  };
  const togglePermission = (key) => {
    if (!selectedPermissionsAccount) return;
    setSelectedPermissionsAccount((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions || {},
        [key]: prev.permissions ? !prev.permissions[key] : true
      }
    }));
  };
  const [showAddDirectorModal, setShowAddDirectorModal] = (0, import_react5.useState)(false);
  const [showEditDirectorModal, setShowEditDirectorModal] = (0, import_react5.useState)(false);
  const [newDirName, setNewDirName] = (0, import_react5.useState)("");
  const [newDirTitle, setNewDirTitle] = (0, import_react5.useState)("\u0645\u062F\u064A\u0631 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649");
  const [newDirEmail, setNewDirEmail] = (0, import_react5.useState)("");
  const [newDirPhone, setNewDirPhone] = (0, import_react5.useState)("");
  const [newDirPass, setNewDirPass] = (0, import_react5.useState)("");
  const [newDirRole, setNewDirRole] = (0, import_react5.useState)("director");
  const [newDirScope, setNewDirScope] = (0, import_react5.useState)("centre");
  const [newDirSide, setNewDirSide] = (0, import_react5.useState)("left");
  const [editingDirector, setEditingDirector] = (0, import_react5.useState)(null);
  const [selectedEstDetails, setSelectedEstDetails] = (0, import_react5.useState)(null);
  const [editingEst, setEditingEst] = (0, import_react5.useState)(null);
  const [qrTabMode, setQrTabMode] = (0, import_react5.useState)("dining");
  const [estSearchTerm, setEstSearchTerm] = (0, import_react5.useState)("");
  const [alertMsg, setAlertMsg] = (0, import_react5.useState)("");
  const [headerInput, setHeaderInput] = (0, import_react5.useState)(config.headerText);
  const [allowUploadToggle, setAllowUploadToggle] = (0, import_react5.useState)(config.allowImageUpload);
  const [allowExternalToggle, setAllowExternalToggle] = (0, import_react5.useState)(config.allowExternalReports);
  const [retentionDropdown, setRetentionDropdown] = (0, import_react5.useState)(config.imageRetention);
  const [scaleSelector, setScaleSelector] = (0, import_react5.useState)(config.uiScale);
  const [cmsHeroTitle, setCmsHeroTitle] = (0, import_react5.useState)(publicCMS.heroTitle);
  const [cmsHeroSubtext, setCmsHeroSubtext] = (0, import_react5.useState)(publicCMS.heroSubtext);
  const [cmsAnnouncement, setCmsAnnouncement] = (0, import_react5.useState)(publicCMS.announcement || "");
  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 4e3);
  };
  const [feedbackType, setFeedbackType] = (0, import_react5.useState)("bug");
  const [feedbackText, setFeedbackText] = (0, import_react5.useState)("");
  const [feedbackSuccess, setFeedbackSuccess] = (0, import_react5.useState)(false);
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSuccess(true);
    setFeedbackText("");
    setTimeout(() => {
      setFeedbackSuccess(false);
    }, 3e3);
  };
  const handleEditEstSubmit = (e) => {
    e.preventDefault();
    if (!editingEst) return;
    setEstablishments((prev) => prev.map((est) => est.id === editingEst.id ? editingEst : est));
    setEditingEst(null);
    triggerAlert("\u2713 \u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0648\u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0628\u0646\u062C\u0627\u062D.");
  };
  const handleSeedData = () => {
    const seeded = [
      {
        id: "est_1",
        name: "\u0645\u0637\u0639\u0645 \u0643\u0628\u0627\u0628 \u0623\u0628\u064A \u062C\u0645\u064A\u0644 \u0627\u0644\u0634\u0647\u064A\u0631 (\u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629)",
        owner: "\u0627\u0644\u062D\u0627\u062C \u0623\u0628\u0648 \u062C\u0645\u064A\u0644 \u0627\u0644\u062C\u0628\u0648\u0631\u064A",
        licenseNumber: "LIC-NIN-9082",
        type: "\u0645\u0637\u0639\u0645",
        sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646 - \u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629",
        neighborhood: "\u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629",
        latitude: "36.3421",
        longitude: "43.1256",
        facebook: "https://facebook.com/mosul_kabab",
        phone: "07701234567",
        status: "compliant",
        score: 94,
        lastInspection: "2026-06-25",
        history: [{ date: "2026-06-25", score: 94, notes: "\u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0628\u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0648\u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u0635\u062D\u064A\u0629 \u0648\u0627\u0644\u0632\u064A \u0627\u0644\u0645\u0648\u062D\u062F \u0645\u0645\u062A\u0627\u0632.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646" }]
      },
      {
        id: "est_2",
        name: "\u0643\u0627\u0641\u064A\u0647 \u0627\u0644\u063A\u0627\u0628\u0627\u062A \u0627\u0644\u0639\u0627\u0626\u0644\u064A (\u062D\u064A \u0627\u0644\u0632\u0647\u0648\u0631)",
        owner: "\u0645\u0631\u0648\u0627\u0646 \u063A\u0627\u0646\u0645 \u064A\u0648\u0646\u0633",
        licenseNumber: "LIC-NIN-1092",
        type: "\u0643\u0648\u0641\u064A\u0634\u0648\u0628",
        sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631 - \u0627\u0644\u0632\u0647\u0648\u0631",
        neighborhood: "\u0627\u0644\u0632\u0647\u0648\u0631",
        latitude: "36.3712",
        longitude: "43.1610",
        facebook: "https://instagram.com/forests_cafe",
        phone: "07504321098",
        status: "compliant",
        score: 91,
        lastInspection: "2026-07-02",
        history: [{ date: "2026-07-02", score: 91, notes: "\u0627\u0644\u0645\u0637\u0628\u062E \u0646\u0638\u064A\u0641 \u0648\u0627\u0644\u0634\u0647\u0627\u062F\u0627\u062A \u0627\u0644\u0635\u062D\u064A\u0629 \u0644\u0644\u0639\u0645\u0627\u0644 \u0645\u062C\u062F\u062F\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631" }]
      },
      {
        id: "est_3",
        name: "\u0642\u0627\u0639\u0629 \u0646\u064A\u0646\u0648\u0649 \u0627\u0644\u0643\u0628\u0631\u0649 \u0644\u0644\u0645\u0646\u0627\u0633\u0628\u0627\u062A (\u062D\u064A \u0627\u0644\u0645\u0635\u0627\u0631\u0641)",
        owner: "\u0639\u0645\u0631 \u062B\u0627\u0645\u0631 \u0627\u0644\u062D\u064A\u0627\u0644\u064A",
        licenseNumber: "LIC-NIN-4432",
        type: "\u0642\u0627\u0639\u0629 \u0623\u0639\u0631\u0627\u0633",
        sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631 - \u062D\u064A \u0627\u0644\u0645\u0635\u0627\u0631\u0641",
        neighborhood: "\u0627\u0644\u0645\u0635\u0627\u0631\u0641",
        latitude: "36.3688",
        longitude: "43.1554",
        facebook: "https://facebook.com/ninveh_hall",
        phone: "07718882233",
        status: "monitoring",
        score: 78,
        lastInspection: "2026-06-28",
        history: [{ date: "2026-06-28", score: 78, notes: "\u062A\u0646\u0628\u064A\u0647 \u0628\u0634\u0623\u0646 \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062A\u0647\u0648\u064A\u0629 \u0648\u062A\u0635\u0631\u064A\u0641 \u0627\u0644\u0645\u064A\u0627\u0647 \u0627\u0644\u0641\u0648\u0631\u064A \u0641\u064A \u0627\u0644\u0642\u0627\u0639\u0629.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631" }]
      },
      {
        id: "est_4",
        name: "\u0623\u0641\u0631\u0627\u0646 \u0627\u0644\u0635\u0645\u0648\u0646 \u0627\u0644\u0623\u0648\u062A\u0648\u0645\u0627\u062A\u064A\u0643\u064A \u062A\u0644\u0639\u0641\u0631",
        owner: "\u0623\u0631\u0634\u062F \u0625\u0633\u0645\u0627\u0639\u064A\u0644 \u062D\u0633\u0646",
        licenseNumber: "LIC-NIN-7781",
        type: "\u0645\u062E\u0628\u0632 / \u0623\u0641\u0631\u0627\u0646",
        sector: "\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631 - \u0645\u0631\u0643\u0632 \u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631",
        neighborhood: "\u0645\u0631\u0643\u0632 \u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631",
        latitude: "36.3755",
        longitude: "42.4498",
        facebook: "https://facebook.com/telafar_bakery",
        phone: "07705556677",
        status: "compliant",
        score: 95,
        lastInspection: "2026-06-20",
        history: [{ date: "2026-06-20", score: 95, notes: "\u0645\u0637\u0627\u0628\u0642 \u0644\u0643\u0627\u0641\u0629 \u0634\u0631\u0648\u0637 \u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0648\u0635\u062D\u0629 \u0627\u0644\u0639\u0645\u0627\u0644 \u0645\u062C\u062F\u062F\u0629.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629 - \u062A\u0644\u0639\u0641\u0631" }]
      },
      {
        id: "est_5",
        name: "\u0645\u0637\u0639\u0645 \u0648\u0627\u062F\u064A \u0639\u064A\u0627\u0636\u064A\u0629 \u0644\u0644\u0645\u0623\u0643\u0648\u0644\u0627\u062A \u0627\u0644\u0634\u0639\u0628\u064A\u0629",
        owner: "\u062D\u0633\u064A\u0646 \u0625\u0628\u0631\u0627\u0647\u064A\u0645 \u062A\u0648\u0631\u0627\u0646",
        licenseNumber: "LIC-NIN-3321",
        type: "\u0645\u0637\u0639\u0645",
        sector: "\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631 - \u0646\u0627\u062D\u064A\u0629 \u0627\u0644\u0639\u064A\u0627\u0636\u064A\u0629",
        neighborhood: "\u0646\u0627\u062D\u064A\u0629 \u0627\u0644\u0639\u064A\u0627\u0636\u064A\u0629",
        latitude: "36.5211",
        longitude: "42.4820",
        facebook: "https://facebook.com/ayadiya_restaurant",
        phone: "07519998822",
        status: "non_compliant",
        score: 55,
        lastInspection: "2026-06-12",
        history: [{ date: "2026-06-12", score: 55, notes: "\u0648\u062C\u0648\u062F \u0644\u062D\u0648\u0645 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629 \u0648\u062A\u062E\u0632\u064A\u0646 \u0633\u064A\u0626. \u062A\u0645 \u062A\u0648\u062C\u064A\u0647 \u0625\u0646\u0630\u0627\u0631 \u0623\u062E\u064A\u0631 \u0642\u0628\u0644 \u0627\u0644\u0625\u063A\u0644\u0627\u0642.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629 - \u062A\u0644\u0639\u0641\u0631" }]
      },
      {
        id: "est_6",
        name: "\u0643\u0627\u0641\u062A\u064A\u0631\u064A\u0627 \u0637\u0627\u0644\u0628\u064A\u064A\u0646 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629",
        owner: "\u0623\u0646\u0633 \u062C\u0627\u0633\u0645 \u0645\u062D\u0645\u062F",
        licenseNumber: "LIC-NIN-9921",
        type: "\u0643\u0648\u0641\u064A\u0634\u0648\u0628",
        sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631 - \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629",
        neighborhood: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629",
        latitude: "36.3811",
        longitude: "43.1490",
        facebook: "https://instagram.com/student_caff",
        phone: "07701122334",
        status: "compliant",
        score: 90,
        lastInspection: "2026-06-29",
        history: [{ date: "2026-06-29", score: 90, notes: "\u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u062C\u064A\u062F\u0629\u060C \u0648\u064A\u062A\u0645 \u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0628\u062C\u062F\u0648\u0644 \u062A\u0646\u0638\u064A\u0641 \u0648\u062A\u0639\u0642\u064A\u0645 \u0627\u0644\u0623\u062F\u0648\u0627\u062A.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631" }]
      },
      {
        id: "est_7",
        name: "\u062D\u0644\u0648\u064A\u0627\u062A \u0643\u0631\u0632 \u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u062A\u0631\u0627\u062B\u064A\u0629 (\u0627\u0644\u062F\u0648\u0627\u0633\u0629)",
        owner: "\u0631\u064A\u0627\u0636 \u0630\u0646\u0648\u0646 \u0627\u0644\u0633\u0646\u062C\u0631\u064A",
        licenseNumber: "LIC-NIN-4091",
        type: "\u0645\u0637\u0639\u0645",
        sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646 - \u0627\u0644\u062F\u0648\u0627\u0633\u0629",
        neighborhood: "\u0627\u0644\u062F\u0648\u0627\u0633\u0629",
        latitude: "36.3385",
        longitude: "43.1311",
        facebook: "https://facebook.com/karaz_sweets",
        phone: "07504445566",
        status: "compliant",
        score: 93,
        lastInspection: "2026-07-01",
        history: [{ date: "2026-07-01", score: 93, notes: "\u0623\u0648\u0627\u0646\u064A \u0627\u0644\u0648\u062C\u0628\u0627\u062A \u0646\u0638\u064A\u0641\u0629 \u0648\u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0628\u0627\u0644\u0632\u064A \u0627\u0644\u0635\u062D\u064A \u0627\u0644\u0631\u0633\u0645\u064A \u0645\u0645\u062A\u0627\u0632.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646" }]
      },
      {
        id: "est_8",
        name: "\u0642\u0627\u0639\u0629 \u0628\u0631\u0637\u0644\u0629 \u0644\u0644\u0645\u0646\u0627\u0633\u0628\u0627\u062A \u0627\u0644\u0633\u0639\u064A\u062F\u0629",
        owner: "\u0628\u0647\u0646\u0627\u0645 \u064A\u0648\u0633\u0641 \u0635\u0644\u064A\u0648\u0627",
        licenseNumber: "LIC-NIN-1234",
        type: "\u0642\u0627\u0639\u0629 \u0623\u0639\u0631\u0627\u0633",
        sector: "\u0642\u0636\u0627\u0621 \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A\u0629 - \u0646\u0627\u062D\u064A\u0629 \u0628\u0631\u0637\u0644\u0629",
        neighborhood: "\u0646\u0627\u062D\u064A\u0629 \u0628\u0631\u0637\u0644\u0629",
        latitude: "36.3456",
        longitude: "43.3789",
        facebook: "https://facebook.com/bartella_hall",
        phone: "07707772211",
        status: "monitoring",
        score: 72,
        lastInspection: "2026-06-15",
        history: [{ date: "2026-06-15", score: 72, notes: "\u062A\u0646\u0628\u064A\u0647 \u0639\u0627\u062C\u0644 \u0644\u0633\u0644\u0627\u0645\u0629 \u0645\u062E\u0627\u0631\u062C \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0648\u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u062D\u0631\u0627\u0626\u0642 \u0628\u0642\u0627\u0637\u0639\u0647.", inspectorName: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0641\u064A \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A\u0629" }]
      }
    ];
    setEstablishments(seeded);
    triggerAlert("\u{1F680} \u062A\u0645 \u062A\u063A\u0630\u064A\u0629 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0645\u0646 Google Maps \u0648\u0627\u0644\u0645\u0646\u0635\u0627\u062A \u0628\u0646\u062C\u0627\u062D!");
  };
  const addField = (type, isEdit = false) => {
    if (isEdit) {
      if (type === "doc") setEditDoctors([...editDoctors, ""]);
      if (type === "asst") setEditAssistants([...editAssistants, ""]);
      if (type === "tech") setEditTechnicians([...editTechnicians, ""]);
    } else {
      if (type === "doc") setDoctors([...doctors, ""]);
      if (type === "asst") setAssistants([...assistants, ""]);
      if (type === "tech") setTechnicians([...technicians, ""]);
    }
  };
  const removeField = (type, index, isEdit = false) => {
    if (isEdit) {
      if (type === "doc") setEditDoctors(editDoctors.filter((_, i) => i !== index));
      if (type === "asst") setEditAssistants(editAssistants.filter((_, i) => i !== index));
      if (type === "tech") setEditTechnicians(editTechnicians.filter((_, i) => i !== index));
    } else {
      if (type === "doc") setDoctors(doctors.filter((_, i) => i !== index));
      if (type === "asst") setAssistants(assistants.filter((_, i) => i !== index));
      if (type === "tech") setTechnicians(technicians.filter((_, i) => i !== index));
    }
  };
  const handleFieldChange = (type, index, value, isEdit = false) => {
    if (isEdit) {
      if (type === "doc") {
        const updated = [...editDoctors];
        updated[index] = value;
        setEditDoctors(updated);
      }
      if (type === "asst") {
        const updated = [...editAssistants];
        updated[index] = value;
        setEditAssistants(updated);
      }
      if (type === "tech") {
        const updated = [...editTechnicians];
        updated[index] = value;
        setEditTechnicians(updated);
      }
    } else {
      if (type === "doc") {
        const updated = [...doctors];
        updated[index] = value;
        setDoctors(updated);
      }
      if (type === "asst") {
        const updated = [...assistants];
        updated[index] = value;
        setAssistants(updated);
      }
      if (type === "tech") {
        const updated = [...technicians];
        updated[index] = value;
        setTechnicians(updated);
      }
    }
  };
  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeamName || !newTeamEmail || !newTeamPhone) {
      triggerAlert("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u0643\u0627\u0641\u0629 \u062D\u0642\u0648\u0644 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629.");
      return;
    }
    if (!newTeamPass) {
      triggerAlert("\u064A\u0631\u062C\u0649 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0645\u0634\u0641\u0631\u0629 \u0622\u0645\u0646\u0629 \u0644\u0644\u062C\u0646\u0629.");
      return;
    }
    let calculatedSector = "";
    if (generalScope === "mosul") {
      calculatedSector = `${mosulSide === "left" ? "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631" : "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646"} - ${mosulNeighborhood}`;
    } else {
      calculatedSector = `${districtName} - ${districtSubsector}`;
    }
    const newTeamObj = {
      id: "team_" + Date.now(),
      name: newTeamName,
      sector: calculatedSector,
      email: newTeamEmail,
      phone: newTeamPhone,
      active: true,
      permissions: {
        manageEstablishments: false,
        createEst: false,
        editEst: false,
        deleteEst: false,
        addEval: false,
        showMainDashboard: false,
        showReportsPage: false,
        showDirectivesPage: false,
        showDeliveryPage: false,
        showPublicEvalsPage: false,
        sendDirective: false,
        replyDirective: false
      },
      members: {
        doctors: doctors.filter((d) => d.trim() !== ""),
        assistants: assistants.filter((a) => a.trim() !== ""),
        technicians: technicians.filter((t) => t.trim() !== "")
      }
    };
    setTeams((prev) => [...prev, newTeamObj]);
    triggerAlert(`\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0639\u064A\u064A\u0646 \u062D\u0633\u0627\u0628 (${newTeamName}) \u0628\u0646\u062C\u0627\u062D.`);
    setNewTeamName("");
    setNewTeamEmail("");
    setNewTeamPhone("");
    setNewTeamPass("");
    setDoctors([""]);
    setAssistants([""]);
    setTechnicians([""]);
    setStep(1);
    setShowAddTeamModal(false);
  };
  const handleOpenAddAccount = () => {
    setAccountModalState({ isOpen: true, mode: "add", data: null });
  };
  const handleOpenEditAccount = (account) => {
    setAccountModalState({ isOpen: true, mode: "edit", data: account });
  };
  const handleSaveAccount = (accountData) => {
    if (accountModalState.mode === "add") {
      const newAccount = {
        ...accountData,
        id: accountData.isTeam ? "team_" + Date.now() : "dir_acc_" + Date.now(),
        permissions: { ...DEFAULT_PERMISSIONS }
      };
      if (accountData.isTeam) {
        setTeams((prev) => [...prev, newAccount]);
      } else {
        setDirectors((prev) => [...prev, newAccount]);
      }
      triggerAlert(`\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062D\u0633\u0627\u0628 (${accountData.name}) \u0628\u0646\u062C\u0627\u062D.`);
    } else {
      if (accountData.isTeam) {
        setTeams((prev) => prev.map((t) => t.id === accountData.id ? accountData : t));
      } else {
        setDirectors((prev) => prev.map((d) => d.id === accountData.id ? accountData : d));
      }
      triggerAlert(`\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628 (${accountData.name}) \u0628\u0646\u062C\u0627\u062D.`);
    }
    setAccountModalState({ isOpen: false, mode: "add", data: null });
  };
  const handleDeleteAccount = (id, isTeam) => {
    if (isTeam) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
    } else {
      setDirectors((prev) => prev.filter((d) => d.id !== id));
    }
    triggerAlert("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0646\u0647\u0627\u0626\u064A\u0627\u064B \u0648\u0633\u062D\u0628 \u0631\u0645\u0648\u0632 \u0627\u0644\u0648\u0635\u0648\u0644.");
  };
  const saveZeroCodeConfig = () => {
    setConfig((prev) => ({
      ...prev,
      headerText: headerInput,
      allowImageUpload: allowUploadToggle,
      allowExternalReports: allowExternalToggle,
      imageRetention: retentionDropdown,
      uiScale: scaleSelector
    }));
    setPublicCMS({
      heroTitle: cmsHeroTitle,
      heroSubtext: cmsHeroSubtext,
      announcement: cmsAnnouncement
    });
    triggerAlert("\u062A\u0645 \u062D\u0641\u0638 \u0648\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0629 \u0641\u0648\u0631\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0646\u0638\u0627\u0645.");
  };
  const handleItemTextChange = (id, newText) => {
    setInspectionItems((prev) => prev.map((item) => item.id === id ? { ...item, text: newText } : item));
  };
  const handleItemPointsChange = (id, newPoints) => {
    setInspectionItems((prev) => prev.map((item) => item.id === id ? { ...item, points: parseInt(newPoints) || 0 } : item));
  };
  const handleAddChecklistItem = () => {
    const newId = inspectionItems.length > 0 ? Math.max(...inspectionItems.map((i) => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      section: "A",
      text: "\u0628\u0646\u062F \u0641\u062D\u0635 \u0631\u0642\u0627\u0628\u064A \u0645\u0636\u0627\u0641 \u062D\u062F\u064A\u062B\u0627\u064B - \u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0637 \u0627\u0644\u0635\u062D\u064A \u0647\u0646\u0627.",
      points: 5
    };
    setInspectionItems((prev) => [...prev, newItem]);
    triggerAlert("\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0628\u0646\u062F \u0631\u0642\u0627\u0628\u064A \u062C\u062F\u064A\u062F \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0628\u0642\u064A\u0645\u0629 5 \u062F\u0631\u062C\u0627\u062A.");
  };
  const handleDeleteChecklistItem = (id) => {
    setInspectionItems((prev) => prev.filter((item) => item.id !== id));
    triggerAlert("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0628\u0646\u062F \u0627\u0644\u0631\u0642\u0627\u0628\u064A \u0628\u0646\u062C\u0627\u062D.");
  };
  const handleGarbageCollection = () => {
    triggerAlert("\u{1F5D1}\uFE0F \u062A\u0645 \u062A\u0641\u0631\u064A\u063A \u0645\u0633\u0627\u062D\u0629 \u0627\u0644\u0633\u064A\u0631\u0641\u0631 \u0648\u0645\u0633\u062D \u0643\u0627\u0641\u0629 \u0645\u0644\u0641\u0627\u062A \u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u0624\u0642\u062A \u0644\u0644\u0635\u0648\u0631 \u0628\u0646\u062C\u0627\u062D.");
  };
  const handleBackupExport = () => {
    const dataStr = JSON.stringify({
      establishments,
      reports,
      teams,
      inspectionItems,
      directors,
      directives,
      config
    }, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `ninveh_health_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    triggerAlert("\u{1F4BE} \u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0644\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u0646\u0632\u064A\u0644 \u0627\u0644\u0645\u0644\u0641.");
  };
  const handleBackupImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.establishments) setEstablishments(parsed.establishments);
          if (parsed.teams) setTeams(parsed.teams);
          if (parsed.inspectionItems) setInspectionItems(parsed.inspectionItems);
          if (parsed.directors) setDirectors(parsed.directors);
          if (parsed.reports) setReports(parsed.reports);
          if (parsed.directives) setDirectives(parsed.directives);
          if (parsed.config) setConfig(parsed.config);
          triggerAlert("\u{1F4C2} \u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0648\u062F\u0645\u062C \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u062D\u062F\u064A\u062B \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0627\u0644\u0643\u0627\u0645\u0644.");
        } catch (err) {
          triggerAlert("\u274C \u062E\u0637\u0623: \u0635\u064A\u063A\u0629 \u0645\u0644\u0641 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629 \u0623\u0648 \u0645\u0639\u0637\u0648\u0628\u0629.");
        }
      };
    }
  };
  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 md:p-8 transition-colors duration-300" }, /* @__PURE__ */ import_react5.default.createElement("header", { className: "max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 glassmorphic-card p-4 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react5.default.createElement(AnimatedLogo, { variant: "sidebar", className: "border-none p-0" }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" }), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h1", { className: "text-xs font-black text-slate-800 dark:text-white" }, "\u0634\u0627\u0634\u0629 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u0631\u0643\u0632\u064A \u0644\u0644\u0646\u0638\u0627\u0645"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10px] text-slate-400" }, "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0633\u064A\u062F\u064A \u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064A \u{1F44B}"))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-650 dark:text-slate-350" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-xl" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F4C5} ", (/* @__PURE__ */ new Date()).toLocaleDateString("ar-IQ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-slate-300" }, "|"), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u23F0 ", (/* @__PURE__ */ new Date()).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20" }, /* @__PURE__ */ import_react5.default.createElement("span", null, " Mosul \u0627\u0644\u0637\u0642\u0633 \u0641\u064A \u0627\u0644\u0645\u0648\u0635\u0644: 38\xB0C \u0645\u0634\u0645\u0633 \u2600\uFE0F")), /* @__PURE__ */ import_react5.default.createElement(ThemeToggle, null), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleLogout,
      className: "px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer font-black"
    },
    "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "max-w-7xl mx-auto flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-2 whitespace-nowrap" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("roster"),
      className: `px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${activeTab === "roster" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Users, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F465} \u0625\u062F\u0627\u0631\u0629 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0644\u062C\u0627\u0646 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("settings"),
      className: `px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${activeTab === "settings" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u2699\uFE0F \u0627\u0644\u0635\u0641\u062D\u0627\u062A")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("sandbox"),
      className: `px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${activeTab === "sandbox" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Compass, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F9EA} \u0628\u064A\u0626\u0629 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("establishments"),
      className: `px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${activeTab === "establishments" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Building, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F37D}\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0634\u0623\u0629")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("audit"),
      className: `px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${activeTab === "audit" ? "bg-teal-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.ShieldAlert, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F6E1}\uFE0F \u062A\u0639\u062F\u064A\u0644\u0627\u062A")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "max-w-7xl mx-auto" }, alertMsg && /* @__PURE__ */ import_react5.default.createElement("div", { className: "mb-4 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold text-center" }, /* @__PURE__ */ import_react5.default.createElement("span", null, alertMsg)), activeTab === "roster" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "glassmorphic-card p-6" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubRosterTab("committees"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subRosterTab === "committees" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F465} \u0625\u062F\u0627\u0631\u0629 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0644\u062C\u0627\u0646 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629 (",
    teams.length,
    ")"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubRosterTab("directors"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subRosterTab === "directors" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F4BC} \u0625\u062F\u0627\u0631\u0629 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u062F\u0631\u0627\u0621 \u0648\u0627\u0644\u0642\u064A\u0627\u062F\u0627\u062A (",
    directors?.length || 0,
    ")"
  )), subRosterTab === "committees" ? /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-sm font-black text-slate-800 dark:text-white" }, "\u062C\u062F\u0648\u0644 \u0627\u0644\u0641\u0631\u0642 \u0648\u0645\u062D\u0631\u0643 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, "\u062A\u0648\u0644\u064A\u062F \u062D\u0633\u0627\u0628\u0627\u062A \u0644\u062C\u0627\u0646 \u0627\u0644\u062A\u0641\u062A\u064A\u0634 \u0648\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A \u0627\u0644\u0642\u0637\u0627\u0639\u064A\u0629 \u0641\u064A \u0646\u064A\u0646\u0648\u0649")), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleOpenAddAccount(),
      className: "px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
    },
    "\u2795 \u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0639\u064A\u064A\u0646 \u0641\u0631\u064A\u0642 \u062A\u0641\u062A\u064A\u0634 \u062C\u062F\u064A\u062F"
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 font-bold block mb-1" }, "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0645\u0633\u062C\u0644\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xl font-black text-slate-800 dark:text-white" }, teams.length)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 font-bold block mb-1" }, "\u0627\u0644\u0644\u062C\u0627\u0646 \u0627\u0644\u0646\u0634\u0637\u0629 \u0627\u0644\u0622\u0646"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xl font-black text-emerald-500" }, teams.filter((t) => t.active).length)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 font-bold block mb-1" }, "\u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u062C\u0645\u062F\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xl font-black text-red-500" }, teams.filter((t) => !t.active).length)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 font-bold block mb-1" }, "\u0627\u0644\u0627\u0644\u0642\u0637\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u063A\u0637\u0627\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xl font-black text-slate-800 dark:text-white" }, new Set(teams.map((t) => t.sector)).size))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react5.default.createElement("table", { className: "w-full text-right border-collapse text-xs font-bold" }, /* @__PURE__ */ import_react5.default.createElement("thead", null, /* @__PURE__ */ import_react5.default.createElement("tr", { className: "bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-850 text-slate-500" }, /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0633\u0645 \u0641\u0631\u064A\u0642 \u0627\u0644\u062A\u0641\u062A\u064A\u0634 (\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u0641\u0627\u0635\u064A\u0644)"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0643\u0644\u0641"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u0644\u062C\u0646\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4 text-center" }, "\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0648\u0627\u0644\u0633\u062D\u0628"))), /* @__PURE__ */ import_react5.default.createElement("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800/40" }, teams.map((t) => /* @__PURE__ */ import_react5.default.createElement("tr", { key: t.id, className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/10" }, /* @__PURE__ */ import_react5.default.createElement(
    "td",
    {
      onClick: () => setSelectedTeamDetails(t),
      className: "p-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-1.5"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Info, { className: "w-4 h-4 text-slate-400 shrink-0" }),
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "underline decoration-dotted" }, t.name)
  ), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-teal-600 dark:text-teal-400" }, "\u0642\u0637\u0627\u0639 ", t.sector), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-slate-500 font-normal dir-ltr" }, t.email), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-slate-500" }, t.phone), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4" }, t.active ? /* @__PURE__ */ import_react5.default.createElement("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]" }, "\u0646\u0634\u0637 \u0648\u0635\u0627\u0644\u062D") : /* @__PURE__ */ import_react5.default.createElement("span", { className: "px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]" }, "\u0645\u062C\u0645\u062F \u0645\u0624\u0642\u062A\u0627\u064B")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex justify-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleOpenEditAccount({ ...t, isTeam: true }),
      className: "px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Edit, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u062A\u0639\u062F\u064A\u0644")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setSelectedPermissionsAccount({ ...t, role: "team" });
        setShowPermissionsModal(true);
      },
      className: "px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0627\u0644\u0623\u0630\u0648\u0646\u0627\u062A")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => toggleFreezeTeam(t.id),
      className: `px-2.5 py-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${t.active ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600"}`
    },
    t.active ? "\u23F8\uFE0F \u062A\u062C\u0645\u064A\u062F \u0645\u0624\u0642\u062A" : "\u25B6\uFE0F \u062A\u0646\u0634\u064A\u0637"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleDeleteTeam(t.id),
      className: "px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
    },
    "\u274C \u062D\u0630\u0641"
  ))))))))) : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-sm font-black text-slate-800 dark:text-white" }, "\u062C\u062F\u0648\u0644 \u0645\u062F\u0631\u0627\u0621 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0631\u0624\u0633\u0627\u0621 \u0627\u0644\u0644\u062C\u0627\u0646 \u0627\u0644\u0635\u062D\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, "\u062A\u0648\u0644\u064A\u062F \u0648\u0625\u062F\u0627\u0631\u0629 \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0642\u064A\u0627\u062F\u0627\u062A \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629 \u0648\u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649 \u0627\u0644\u0645\u0631\u0643\u0632\u064A\u0629")), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleOpenAddAccount(),
      className: "px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
    },
    "\u2795 \u0625\u0636\u0627\u0641\u0629 \u062D\u0633\u0627\u0628 \u0645\u062F\u064A\u0631 \u062C\u062F\u064A\u062F"
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react5.default.createElement("table", { className: "w-full text-right border-collapse text-xs font-bold" }, /* @__PURE__ */ import_react5.default.createElement("thead", null, /* @__PURE__ */ import_react5.default.createElement("tr", { className: "bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-850 text-slate-500" }, /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A / \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4" }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-4 text-center" }, "\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0648\u0627\u0644\u0633\u062D\u0628"))), /* @__PURE__ */ import_react5.default.createElement("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800/40" }, (directors || []).map((d) => /* @__PURE__ */ import_react5.default.createElement("tr", { key: d.id, className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/10" }, /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-slate-800 dark:text-slate-200" }, d.name), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-teal-600 dark:text-teal-400" }, d.title), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-slate-500 font-normal dir-ltr" }, d.email), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4 text-slate-500" }, d.phone), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4" }, d.active ? /* @__PURE__ */ import_react5.default.createElement("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]" }, "\u0646\u0634\u0637 \u0648\u0635\u0627\u0644\u062D") : /* @__PURE__ */ import_react5.default.createElement("span", { className: "px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]" }, "\u0645\u062C\u0645\u062F \u0645\u0624\u0642\u062A\u0627\u064B")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex justify-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setEditingDirector(d);
        setShowEditDirectorModal(true);
      },
      className: "px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Edit, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u062A\u0639\u062F\u064A\u0644")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setSelectedPermissionsAccount(d);
        setShowPermissionsModal(true);
      },
      className: "px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-3.5 h-3.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0627\u0644\u0623\u0630\u0648\u0646\u0627\u062A")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => toggleFreezeDirector(d.id),
      className: `px-2.5 py-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${d.active ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600"}`
    },
    d.active ? "\u23F8\uFE0F \u062A\u062C\u0645\u064A\u062F" : "\u25B6\uFE0F \u062A\u0646\u0634\u064A\u0637"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleDeleteDirector(d.id),
      className: "px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
    },
    "\u274C \u062D\u0630\u0641"
  )))))))))), activeTab === "settings" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "glassmorphic-card p-6" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubSettingsTab("evaluations"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subSettingsTab === "evaluations" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F4DD} \u0645\u062D\u0631\u0631 \u0628\u0646\u0648\u062F \u0627\u0644\u062A\u0642\u064A\u064A\u0645"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubSettingsTab("appearance"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subSettingsTab === "appearance" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F3A8} \u062A\u062E\u0635\u064A\u0635 \u0645\u0638\u0647\u0631 \u0627\u0644\u0646\u0638\u0627\u0645"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubSettingsTab("public_cms"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subSettingsTab === "public_cms" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F310} \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 (CMS)"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubSettingsTab("database"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subSettingsTab === "database" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F4BE} \u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A"
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-1 gap-8" }, subSettingsTab === "appearance" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0623\u0648\u0644\u0627\u064B: \u0645\u062D\u0631\u0643 \u0627\u0644\u062A\u0647\u064A\u0626\u0629 \u0627\u0644\u0628\u0635\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A \u0627\u0644\u0635\u0648\u0631")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062A\u0631\u0648\u064A\u0633\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A \u0644\u0644\u0648\u0627\u062C\u0647\u0627\u062A"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      value: headerInput,
      onChange: (e) => setHeaderInput(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u0645\u0642\u064A\u0627\u0633 \u062D\u062C\u0645 \u0627\u0644\u062E\u0637 \u0628\u0627\u0644\u062E\u0637\u0648\u0637 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: scaleSelector,
      onChange: (e) => setScaleSelector(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "small" }, "\u0635\u063A\u064A\u0631 (\u0645\u0636\u063A\u0648\u0637 \u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u062C\u0648\u0627\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "normal" }, "\u0639\u0627\u062F\u064A \u0648\u0645\u062A\u0648\u0633\u0637 (\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0644\u0644\u0645\u0646\u0638\u0648\u0645\u0629)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "large" }, "\u0636\u062E\u0645 (\u0644\u0643\u0628\u0627\u0631 \u0627\u0644\u0633\u0646 \u0648\u0636\u0639\u0627\u0641 \u0627\u0644\u0628\u0635\u0631)")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4 pt-2" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "flex items-center justify-between cursor-pointer select-none" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col text-right" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300" }, "\u062A\u0641\u0639\u064A\u0644 \u0645\u064A\u0632\u0629 \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631 \u0628\u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u064A\u062D\u0648\u0644 \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0643\u0644\u064A\u0627\u064B \u0644\u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0646\u0635\u064A\u0629")), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: allowUploadToggle,
      onChange: () => setAllowUploadToggle(!allowUploadToggle),
      className: "w-10 h-5 accent-teal-600 cursor-pointer"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "flex items-center justify-between cursor-pointer select-none" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col text-right" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300" }, "\u062A\u0641\u0639\u064A\u0644 \u0631\u0627\u0628\u0637 \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u0632\u0644\u064A"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u062E\u062F\u0645\u0629 \u064A\u0648\u062C\u0647 \u0627\u0644\u0632\u0627\u0626\u0631\u064A\u0646 \u0644\u0635\u0641\u062D\u0629 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0635\u064A\u0627\u0646\u0629")), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: allowExternalToggle,
      onChange: () => setAllowExternalToggle(!allowExternalToggle),
      className: "w-10 h-5 accent-teal-600 cursor-pointer"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u062A\u062D\u062F\u064A\u062F \u0645\u0647\u0644\u0629 \u062D\u0630\u0641 \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: retentionDropdown,
      onChange: (e) => setRetentionDropdown(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "3 Months" }, "\u062D\u0630\u0641 \u062A\u0644\u0642\u0627\u0626\u064A \u0628\u0639\u062F 3 \u0623\u0634\u0647\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "6 Months" }, "\u062D\u0630\u0641 \u062A\u0644\u0642\u0627\u0626\u064A \u0628\u0639\u062F 6 \u0623\u0634\u0647\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "12 Months" }, "\u062D\u0630\u0641 \u062A\u0644\u0642\u0627\u0626\u064A \u0628\u0639\u062F \u0633\u0646\u0629 \u0643\u0627\u0645\u0644\u0629"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "Disable Auto-Delete" }, "\u062A\u0639\u0637\u064A\u0644 \u0627\u0644\u062D\u0630\u0641 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0644\u0645\u0633\u062A\u0648\u062F\u0639")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex gap-2 justify-between flex-wrap" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleGarbageCollection,
      className: "px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 text-amber-600 font-extrabold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Database, { className: "w-4 h-4" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F5D1}\uFE0F \u062A\u0641\u0631\u064A\u063A \u0645\u0633\u0627\u062D\u0629 \u0627\u0644\u0633\u064A\u0631\u0641\u0631 \u064A\u062F\u0648\u064A\u064B\u0627")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: saveZeroCodeConfig,
      className: "px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer"
    },
    "\u062D\u0641\u0638 \u0648\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062A\u0647\u064A\u0626\u0629"
  )))), subSettingsTab === "public_cms" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0625\u062F\u0627\u0631\u0629 \u0645\u062D\u062A\u0648\u0649 \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 (Public Search CMS)")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10px] text-slate-400 leading-relaxed text-right" }, "\u0645\u0646 \u0647\u0646\u0627 \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062A\u062D\u0643\u0645 \u0641\u064A \u0627\u0644\u0646\u0635\u0648\u0635 \u0648\u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u062A\u0631\u062D\u064A\u0628\u064A\u0629 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629 \u0644\u0644\u0645\u0648\u0627\u0637\u0646\u064A\u0646 \u0641\u064A \u0634\u0627\u0634\u0629 \u0627\u0644\u0628\u062D\u062B \u0627\u0644\u0639\u0627\u0645 (\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0645\u0648\u0627\u0637\u0646)."), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062A\u0631\u062D\u064A\u0628\u064A \u0627\u0644\u0631\u0626\u064A\u0633\u064A"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      value: cmsHeroTitle,
      onChange: (e) => setCmsHeroTitle(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u0627\u0644\u0648\u0635\u0641 \u0623\u0648 \u0627\u0644\u0625\u0631\u0634\u0627\u062F\u0627\u062A \u0644\u0644\u0645\u0648\u0627\u0637\u0646\u064A\u0646"), /* @__PURE__ */ import_react5.default.createElement(
    "textarea",
    {
      rows: "3",
      value: cmsHeroSubtext,
      onChange: (e) => setCmsHeroSubtext(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-xs font-bold text-slate-500 block" }, "\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0627\u062C\u0644\u0629 \u0644\u0644\u0645\u0648\u0627\u0637\u0646\u064A\u0646 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0643\u062A\u0628 \u0625\u0639\u0644\u0627\u0646\u0627\u064B \u0645\u0647\u0645\u0627\u064B \u0623\u0648 \u0627\u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B",
      value: cmsAnnouncement,
      onChange: (e) => setCmsAnnouncement(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex gap-2 justify-end mt-4" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: saveZeroCodeConfig,
      className: "px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer"
    },
    "\u062D\u0641\u0638 \u0648\u0646\u0634\u0631 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0639\u0644\u0649 \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0648\u0627\u0637\u0646"
  )))), subSettingsTab === "database" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Database, { className: "w-5 h-5 text-teal-600 animate-pulse" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0648\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10px] text-slate-400 leading-relaxed text-right" }, "\u062A\u062A\u064A\u062D \u0644\u0643 \u0647\u0630\u0647 \u0627\u0644\u062E\u062F\u0645\u0629 \u0633\u062D\u0628 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0628\u0645\u0627 \u062A\u0634\u0645\u0644\u0647 \u0645\u0646 \u062D\u0633\u0627\u0628\u0627\u062A \u0645\u062F\u0631\u0627\u0621\u060C \u0644\u062C\u0627\u0646 \u062A\u0641\u062A\u064A\u0634\u060C \u0645\u0646\u0634\u0622\u062A \u063A\u0630\u0627\u0626\u064A\u0629\u060C \u0628\u0646\u0648\u062F \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u060C \u0648\u0634\u0643\u0627\u0648\u0649\u060C \u0648\u062A\u062E\u0632\u064A\u0646\u0647\u0627 \u0641\u064A \u0645\u0644\u0641 \u0628\u0635\u064A\u063A\u0629 JSON \u0644\u0627\u0633\u062A\u0639\u0627\u062F\u062A\u0647\u0627 \u0623\u0648 \u062F\u0645\u062C\u0647\u0627 \u0628\u0623\u064A \u0648\u0642\u062A."), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between p-3 rounded-2xl bg-teal-500/5 border border-teal-500/10 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-black text-slate-850 dark:text-slate-200" }, "\u062A\u0635\u062F\u064A\u0631 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A (.JSON)"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 font-medium" }, "\u062A\u062D\u0645\u064A\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0648\u062D\u0641\u0638\u0647\u0627 \u0639\u0644\u0649 \u062D\u0627\u0633\u0648\u0628\u0643")), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleBackupExport,
      className: "px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer whitespace-nowrap"
    },
    "\u{1F4E5} \u0639\u0645\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629"
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-black text-slate-850 dark:text-slate-200" }, "\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0648\u062F\u0645\u062C \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 font-medium font-bold" }, "\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0646 \u0645\u0644\u0641 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0633\u0627\u0628\u0642")), /* @__PURE__ */ import_react5.default.createElement("label", { className: "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-650 text-white font-extrabold text-[11px] transition-all cursor-pointer text-center whitespace-nowrap" }, "\u{1F4E4} \u0631\u0641\u0639 \u0648\u0627\u0633\u062A\u0639\u0627\u062F\u0629", /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "file",
      accept: ".json",
      onChange: handleBackupImport,
      className: "hidden"
    }
  ))))), subSettingsTab === "evaluations" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 flex flex-col justify-between" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Shield, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u062B\u0627\u0646\u064A\u0627\u064B: \u0645\u062D\u0631\u0631 \u0646\u0635\u0648\u0635 \u0628\u0646\u0648\u062F \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0639\u0634\u0631\u0648\u0646")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10px] text-slate-400 mb-4 leading-relaxed" }, "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0635\u064A\u0627\u063A\u0629 \u0627\u0644\u0644\u063A\u0648\u064A\u0629 \u0644\u0623\u064A \u0628\u0646\u062F \u0645\u0646 \u0628\u0646\u0648\u062F \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0639\u0634\u0631\u064A\u0646 \u0623\u0648 \u062D\u0630\u0641\u0647\u0627 \u0648\u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0648\u062A\u062D\u062F\u064A\u062B\u0647\u0627 \u0641\u0648\u0631\u064A\u0627\u064B \u0639\u0644\u0649 \u0627\u0633\u062A\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0641\u062A\u0634\u064A\u0646 \u0628\u0627\u0644\u0645\u064A\u062F\u0627\u0646:"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-3.5 max-h-[360px] overflow-y-auto pr-1" }, inspectionItems.map((item, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: item.id, className: "flex gap-2 items-start py-1.5 border-b border-slate-100 dark:border-slate-800/40" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 mt-2" }, idx + 1), /* @__PURE__ */ import_react5.default.createElement(
    "textarea",
    {
      rows: "2",
      value: item.text,
      onChange: (e) => handleItemTextChange(item.id, e.target.value),
      className: "flex-1 p-2 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:border-teal-500 text-slate-700 dark:text-slate-300"
    }
  ), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col gap-1 shrink-0" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[8px] text-slate-450 font-bold block text-center" }, "\u0627\u0644\u062F\u0631\u062C\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "number",
      value: item.points || 5,
      onChange: (e) => handleItemPointsChange(item.id, e.target.value),
      className: "w-12 p-1 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[11px] font-black text-center text-teal-600 dark:text-teal-400 outline-none focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => handleDeleteChecklistItem(item.id),
      className: "p-1 rounded-lg text-red-500 hover:bg-red-500/10 mt-3 cursor-pointer shrink-0"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4 h-4" })
  ))))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleAddChecklistItem,
      className: "mt-4 w-full py-3 rounded-xl border border-dashed border-teal-500/30 hover:border-teal-500/60 text-teal-600 dark:text-teal-400 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u2795 \u0625\u0636\u0627\u0641\u0629 \u0628\u0646\u062F \u0631\u0642\u0627\u0628\u064A \u062C\u062F\u064A\u062F \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645")
  )))), activeTab === "sandbox" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Compass, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F504} \u0646\u0638\u0627\u0645 \u0645\u062D\u0627\u0643\u0627\u0629 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0648\u0641\u062D\u0635 \u0627\u0644\u0648\u0627\u062C\u0647\u0627\u062A")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-xs text-slate-500 leading-relaxed" }, "\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0623\u064A \u0645\u0646 \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629 \u0628\u0627\u0644\u0623\u0633\u0641\u0644 \u0644\u062A\u0642\u0645\u0635 \u062F\u0648\u0631 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641 \u0648\u062A\u062C\u0631\u0628\u0629 \u0648\u0627\u062C\u0647\u062A\u0647 \u0641\u0648\u0631\u0627\u064B (CRUD / \u0639\u0631\u0636 \u0648\u0641\u0635\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A) \u062F\u0648\u0646 \u0627\u0644\u062D\u0627\u062C\u0629 \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0627\u0644\u0645\u062A\u0643\u0631\u0631:"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        const realDir = directors?.find((d) => d.email === "director@ninveh.health.gov.iq" || d.role === "director");
        setUser(realDir ? { ...realDir } : { role: "director", name: "\u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0639\u0627\u0645 \u0644\u062F\u0627\u0626\u0631\u0629 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649", email: "director@ninveh.health.gov.iq" });
        navigate("/dashboard/director");
      },
      className: "w-full p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex justify-between items-center transition-all cursor-pointer hover:-translate-y-1"
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0631\u0624\u064A\u0629 \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629 \u0639\u0644\u064A\u0627"),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F4BC} \u062D\u0633\u0627\u0628 \u0645\u062F\u064A\u0631 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649 \u0627\u0644\u0639\u0627\u0645 (\u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0639\u0627\u0645)")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        const realDir = directors?.find((d) => d.email === "committee_director@ninveh.health.gov.iq" || d.role === "committee_director");
        setUser(realDir ? { ...realDir } : { role: "director_committee", name: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0644\u0645\u062D\u0627\u0641\u0638\u0629 \u0646\u064A\u0646\u0648\u0649", email: "committee_director@ninveh.health.gov.iq" });
        navigate("/dashboard/director");
      },
      className: "w-full p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex justify-between items-center transition-all cursor-pointer hover:-translate-y-1"
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0631\u0624\u064A\u0629 \u062A\u0634\u063A\u064A\u0644\u064A\u0629 \u0648\u062A\u0643\u0644\u064A\u0641\u0627\u062A \u0644\u0644\u0641\u0631\u0642"),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F4CB} \u062D\u0633\u0627\u0628 \u0645\u062F\u064A\u0631 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0644\u0645\u062D\u0627\u0641\u0638\u0629 \u0646\u064A\u0646\u0648\u0649")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        const realTeam = teams?.find((t) => t.id === "team_1" || t.email === "team1@ninveh.health.gov.iq");
        setUser(realTeam ? { ...realTeam, role: "team" } : { role: "team", name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631", sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631 - \u0627\u0644\u0632\u0647\u0648\u0631", email: "team1@ninveh.health.gov.iq" });
        navigate("/dashboard/team");
      },
      className: "w-full p-4 rounded-2xl bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/20 text-teal-600 dark:text-teal-400 font-extrabold text-xs flex justify-between items-center transition-all cursor-pointer hover:-translate-y-1"
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0641\u062D\u0635 \u0642\u0627\u0637\u0639 \u0627\u0644\u0623\u064A\u0633\u0631 - \u062D\u064A \u0627\u0644\u0632\u0647\u0648\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F465} \u062D\u0633\u0627\u0628 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A \u0627\u0644\u0623\u0648\u0644 (\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631)")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        const realTeam = teams?.find((t) => t.id === "team_2" || t.email === "team2@ninveh.health.gov.iq");
        setUser(realTeam ? { ...realTeam, role: "team" } : { role: "team", name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629 - \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646", sector: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646 - \u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629", email: "team2@ninveh.health.gov.iq" });
        navigate("/dashboard/team");
      },
      className: "w-full p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold text-xs flex justify-between items-center transition-all cursor-pointer hover:-translate-y-1"
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0641\u062D\u0635 \u0642\u0627\u0637\u0639 \u0627\u0644\u0623\u064A\u0645\u0646 - \u0627\u0644\u0645\u0648\u0635\u0644 \u0627\u0644\u0642\u062F\u064A\u0645\u0629"),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F465} \u062D\u0633\u0627\u0628 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A \u0627\u0644\u062B\u0627\u0646\u064A (\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646)")
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        const realTeam = teams?.find((t) => t.id === "team_3" || t.email === "team3@ninveh.health.gov.iq");
        setUser(realTeam ? { ...realTeam, role: "team" } : { role: "team", name: "\u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629 - \u062A\u0644\u0639\u0641\u0631", sector: "\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631 - \u0645\u0631\u0643\u0632 \u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631", email: "team3@ninveh.health.gov.iq" });
        navigate("/dashboard/team");
      },
      className: "w-full p-4 rounded-2xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-extrabold text-xs flex justify-between items-center transition-all cursor-pointer hover:-translate-y-1"
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0641\u062D\u0635 \u0642\u0627\u0637\u0639 \u0627\u0644\u0623\u0642\u0636\u064A\u0629 - \u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u{1F465} \u062D\u0633\u0627\u0628 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A \u0627\u0644\u062B\u0627\u0644\u062B (\u0642\u0636\u0627\u0621 \u062A\u0644\u0639\u0641\u0631)")
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "glassmorphic-card p-6 space-y-4" }, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Database, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u26A1 \u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0648\u0641\u062D\u0635 \u0627\u0644\u0623\u0648\u0627\u0645\u0631")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-xs text-slate-500 leading-relaxed" }, "\u062A\u063A\u0630\u064A\u0629 \u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629 \u0628\u0646\u0645\u0627\u0630\u062C \u0645\u0637\u0627\u0639\u0645 \u0648\u0643\u0627\u0641\u064A\u0647\u0627\u062A \u0648\u0642\u0627\u0639\u0627\u062A \u0623\u0639\u0631\u0627\u0633 \u062D\u0642\u064A\u0642\u064A\u0629 \u0628\u0646\u064A\u0646\u0648\u0649 \u062A\u0645 \u062C\u0644\u0628\u0647\u0627 \u0645\u0646 \u062E\u0631\u0627\u0626\u0637 \u062C\u0648\u062C\u0644 \u0648\u0627\u0644\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629\u060C \u0634\u0627\u0645\u0644\u0629 \u0627\u0644\u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0648\u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0647\u0648\u0627\u062A\u0641 \u0644\u0641\u062D\u0635 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u0648\u0627\u0644\u0641\u0644\u062A\u0631\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629:"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleSeedData,
      className: "w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/15"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Database, { className: "w-4.5 h-4.5" }),
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u062A\u063A\u0630\u064A\u0629 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u{1F680}")
  )))), activeTab === "establishments" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "glassmorphic-card p-6 text-right space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white" }, "\u{1F37D}\uFE0F \u062F\u0644\u064A\u0644 \u0627\u0644\u0645\u0646\u0634\u0622\u062A \u0648\u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0631\u0645\u0648\u0632 \u0627\u0644\u0640 QR \u0648\u0645\u0644\u0635\u0642\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, "\u0639\u0631\u0636\u060C \u0648\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0637\u0627\u0639\u0645 \u0648\u062A\u0635\u062F\u064A\u0631 \u0645\u0644\u0635\u0642\u0627\u062A \u0627\u0644\u0640 QR \u0627\u0644\u0645\u062E\u0635\u0635\u0629 \u0644\u0644\u0635\u0627\u0644\u0629 \u0648\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062F\u064A\u0644\u064A\u0641\u0631\u064A")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "relative max-w-md" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0645\u0637\u0639\u0645 \u0623\u0648 \u0627\u0644\u0645\u0627\u0644\u0643 \u0623\u0648 \u0635\u0646\u0641 \u0627\u0644\u0646\u0634\u0627\u0637...",
      value: estSearchTerm,
      onChange: (e) => setEstSearchTerm(e.target.value),
      className: "w-full pl-4 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 text-xs font-bold outline-none text-slate-850 dark:text-slate-200 focus:border-teal-500"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Search, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" })), /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react5.default.createElement("table", { className: "w-full text-right border-collapse text-xs" }, /* @__PURE__ */ import_react5.default.createElement("thead", null, /* @__PURE__ */ import_react5.default.createElement("tr", { className: "bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400" }, /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 / \u0627\u0644\u0631\u062E\u0635\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0646\u0648\u0639 \u0627\u0644\u0646\u0634\u0627\u0637"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0627\u0644\u0645\u0627\u0644\u0643 / \u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0627\u0644\u0642\u0637\u0627\u0639"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold text-center" }, "\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), /* @__PURE__ */ import_react5.default.createElement("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800/40" }, establishments.filter(
    (e) => e.name.toLowerCase().includes(estSearchTerm.toLowerCase()) || e.owner.toLowerCase().includes(estSearchTerm.toLowerCase()) || e.type.toLowerCase().includes(estSearchTerm.toLowerCase())
  ).map((est) => /* @__PURE__ */ import_react5.default.createElement("tr", { key: est.id, className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/10" }, /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-black text-slate-800 dark:text-slate-200" }, est.name), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 font-medium" }, "\u0627\u0644\u0631\u062E\u0635\u0629: ", est.licenseNumber))), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5 font-bold text-slate-600 dark:text-slate-350" }, est.type), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-bold text-slate-700 dark:text-slate-300" }, est.owner), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, est.phone))), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5 text-slate-500 font-bold" }, est.sector), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-black ${est.score >= 90 ? "bg-emerald-500/10 text-emerald-600" : est.score >= 70 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}` }, est.lastInspection === "\u0644\u0645 \u064A\u0632\u0631 \u0628\u0639\u062F" ? "\u0645\u0639\u0644\u0642 \u23F3" : `${est.score}%`)), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex justify-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setSelectedEstDetails(est);
        setQrTabMode("dining");
      },
      className: "px-2.5 py-1.5 rounded-xl bg-slate-550/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 font-bold cursor-pointer transition-all"
    },
    "\u{1F517} \u0631\u0645\u0632 \u0627\u0644\u0640 QR"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setEditingEst(est);
      },
      className: "px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold cursor-pointer transition-all"
    },
    "\u{1F4DD} \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"
  )))))))))), activeTab === "audit" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "glassmorphic-card p-6 text-right space-y-6" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubAuditTab("trail"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer ${subAuditTab === "trail" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    "\u{1F6E1}\uFE0F \u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642 \u0648\u0627\u0644\u0623\u0645\u0627\u0646"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSubAuditTab("tickets"),
      className: `pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${subAuditTab === "tickets" ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-650"}`
    },
    /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0627\u0644\u0631\u062F \u0639\u0644\u0649 \u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u0644\u062C\u0627\u0646"),
    tickets.filter((t) => t.status !== "resolved").length > 0 && /* @__PURE__ */ import_react5.default.createElement("span", { className: "px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px]" }, tickets.filter((t) => t.status !== "resolved").length)
  )), subAuditTab === "trail" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.ShieldAlert, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642 \u0648\u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0623\u0645\u0646\u064A\u0629 (Audit Trail)")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, "\u064A\u0639\u0631\u0636 \u0647\u0630\u0627 \u0627\u0644\u0633\u062C\u0644 \u0643\u0627\u0641\u0629 \u062D\u0631\u0643\u0627\u062A \u0648\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0641\u0631\u0642 \u0648\u0627\u0644\u0645\u062F\u0631\u0627\u0621 \u0645\u0639 \u0623\u0633\u0628\u0627\u0628 \u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0646\u0632\u0627\u0647\u0629 \u0627\u0644\u0646\u0638\u0627\u0645.")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react5.default.createElement("table", { className: "w-full text-right border-collapse text-xs" }, /* @__PURE__ */ import_react5.default.createElement("thead", null, /* @__PURE__ */ import_react5.default.createElement("tr", { className: "bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400" }, /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0627\u0644\u062D\u0631\u0643\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 (\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629)"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0646\u0648\u0639 \u0627\u0644\u0625\u062C\u0631\u0627\u0621"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "p-3.5 font-bold" }, "\u0633\u0628\u0628 \u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0631\u0633\u0645\u064A"))), /* @__PURE__ */ import_react5.default.createElement("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800/40" }, auditLogs && auditLogs.length > 0 ? auditLogs.map((log) => /* @__PURE__ */ import_react5.default.createElement("tr", { key: log.id, className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/10" }, /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5 font-bold text-slate-700 dark:text-slate-300 dir-ltr text-right" }, new Date(log.date).toLocaleString("ar-IQ")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-black text-slate-800 dark:text-slate-200" }, log.user), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 block" }, log.role === "team" ? "\u0641\u0631\u064A\u0642 \u0645\u064A\u062F\u0627\u0646\u064A" : "\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u064A\u0627")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5 font-bold text-teal-600 dark:text-teal-400" }, log.action), /* @__PURE__ */ import_react5.default.createElement("td", { className: "p-3.5 text-slate-600 dark:text-slate-400" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-lg block italic" }, '"', log.justification, '"')))) : /* @__PURE__ */ import_react5.default.createElement("tr", null, /* @__PURE__ */ import_react5.default.createElement("td", { colSpan: "4", className: "p-6 text-center text-slate-400 font-bold" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u062D\u0631\u0643\u0627\u062A \u062A\u0639\u062F\u064A\u0644 \u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645 \u062D\u062A\u0649 \u0627\u0644\u0622\u0646."))))))), subAuditTab === "tickets" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h2", { className: "text-base font-black text-slate-800 dark:text-white flex items-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.ShieldAlert, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u0645\u0631\u0643\u0632 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A \u0648\u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u0644\u062C\u0627\u0646 (Tickets Center)")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, "\u0645\u062A\u0627\u0628\u0639\u0629 \u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A \u0648\u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0648\u0627\u0631\u062F\u0629 \u0645\u0646 \u0627\u0644\u0644\u062C\u0627\u0646 \u0648\u0627\u0644\u0645\u062F\u0631\u0627\u0621.")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4" }, !tickets || tickets.length === 0 ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "text-center py-6 text-slate-500 text-xs font-bold" }, "\u{1F4ED} \u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u062F\u0639\u0645 \u0641\u0646\u064A \u0623\u0648 \u0628\u0644\u0627\u063A\u0627\u062A \u0648\u0627\u0631\u062F\u0629 \u062D\u0627\u0644\u064A\u0627\u064B.") : /* @__PURE__ */ import_react5.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react5.default.createElement("table", { className: "w-full text-right border-collapse text-xs" }, /* @__PURE__ */ import_react5.default.createElement("thead", null, /* @__PURE__ */ import_react5.default.createElement("tr", { className: "border-b border-slate-200 dark:border-slate-800 text-slate-400" }, /* @__PURE__ */ import_react5.default.createElement("th", { className: "py-2 px-3" }, "\u0627\u0644\u0645\u0631\u0633\u0644"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "py-2 px-3" }, "\u0627\u0644\u0646\u0648\u0639"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "py-2 px-3" }, "\u0646\u0635 \u0627\u0644\u0631\u0633\u0627\u0644\u0629/\u0627\u0644\u0645\u0634\u0643\u0644\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "py-2 px-3" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react5.default.createElement("th", { className: "py-2 px-3" }, "\u0627\u0644\u0625\u062C\u0631\u0627\u0621"))), /* @__PURE__ */ import_react5.default.createElement("tbody", null, tickets.map((ticket) => /* @__PURE__ */ import_react5.default.createElement("tr", { key: ticket.id, className: "border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" }, /* @__PURE__ */ import_react5.default.createElement("td", { className: "py-2.5 px-3 font-extrabold text-slate-700 dark:text-slate-350" }, ticket.sender), /* @__PURE__ */ import_react5.default.createElement("td", { className: "py-2.5 px-3" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] ${ticket.type === "bug" ? "bg-red-500/10 text-red-500" : ticket.type === "feature" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}` }, ticket.type === "bug" ? "\u{1F41B} \u062E\u0644\u0644 \u0641\u0646\u064A" : ticket.type === "feature" ? "\u{1F4A1} \u0645\u0642\u062A\u0631\u062D \u0645\u064A\u0632\u0629" : "\u{1F4CA} \u0625\u0634\u0643\u0627\u0644 \u062A\u0642\u0627\u0631\u064A\u0631")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate", title: ticket.text }, ticket.text), /* @__PURE__ */ import_react5.default.createElement("td", { className: "py-2.5 px-3" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] ${ticket.status === "resolved" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500 animate-pulse"}` }, ticket.status === "resolved" ? "\u2713 \u062A\u0645 \u0627\u0644\u062D\u0644" : "\u23F3 \u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629")), /* @__PURE__ */ import_react5.default.createElement("td", { className: "py-2.5 px-3" }, ticket.status !== "resolved" ? /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: "resolved" } : t));
        triggerAlert("\u062A\u0645 \u0625\u063A\u0644\u0627\u0642 \u0648\u0645\u0639\u0627\u0644\u062C\u0629 \u062A\u0630\u0643\u0631\u0629 \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A \u0628\u0646\u062C\u0627\u062D.");
      },
      className: "px-2.5 py-1 rounded bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-[10px] transition-all cursor-pointer"
    },
    "\u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u0625\u063A\u0644\u0627\u0642"
  ) : /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-slate-500 text-[10px]" }, "\u0645\u0643\u062A\u0645\u0644\u0629"))))))))))), selectedTeamDetails && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-teal-400" }, "\u{1F50D} \u0628\u0637\u0627\u0642\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0641\u0631\u064A\u0642 \u0627\u0644\u062A\u0641\u062A\u064A\u0634 \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSelectedTeamDetails(null),
      className: "p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-4.5 h-4.5" })
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4 text-xs" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 block mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0644\u062C\u0646\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-extrabold text-sm" }, selectedTeamDetails.name)), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 block mb-1" }, "\u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0643\u0644\u0641"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-extrabold text-sm text-teal-400" }, selectedTeamDetails.sector))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 block mb-1" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-bold text-slate-300 dir-ltr block text-right" }, selectedTeamDetails.email)), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400 block mb-1" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "font-bold text-slate-300" }, selectedTeamDetails.phone))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "pt-4 border-t border-slate-800" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[11px] font-black text-teal-400 block mb-3" }, "\u{1F465} \u0627\u0644\u0643\u0627\u062F\u0631 \u0627\u0644\u0625\u0634\u0631\u0627\u0641\u064A \u0648\u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 block mb-1" }, "\u0627\u0644\u0623\u0637\u0628\u0627\u0621 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0648\u0646 (\u062F\u0643\u062A\u0648\u0631):"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-wrap gap-2" }, selectedTeamDetails.members?.doctors?.map((doc, idx) => /* @__PURE__ */ import_react5.default.createElement("span", { key: idx, className: "px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-black" }, doc)) || /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-slate-500 text-[10px]" }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0623\u0637\u0628\u0627\u0621 \u0628\u0639\u062F"))), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 block mb-1" }, "\u0645\u0633\u0627\u0639\u062F \u062F\u0643\u062A\u0648\u0631:"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-wrap gap-2" }, selectedTeamDetails.members?.assistants?.map((asst, idx) => /* @__PURE__ */ import_react5.default.createElement("span", { key: idx, className: "px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-black" }, asst)) || /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-slate-500 text-[10px]" }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0645\u0633\u0627\u0639\u062F\u064A\u0646 \u0628\u0639\u062F"))), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 block mb-1" }, "\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u064A\u0646 \u0627\u0644\u0641\u0646\u064A\u064A\u0646:"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-wrap gap-2" }, selectedTeamDetails.members?.technicians?.map((tech, idx) => /* @__PURE__ */ import_react5.default.createElement("span", { key: idx, className: "px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-black" }, tech)) || /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-slate-500 text-[10px]" }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0645\u0644\u0627\u062D\u0638\u064A\u0646 \u0641\u0646\u064A\u064A\u0646 \u0628\u0639\u062F")))))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSelectedTeamDetails(null),
      className: "mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all cursor-pointer"
    },
    "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0646\u0627\u0641\u0630\u0629"
  ))), showAddTeamModal && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-teal-400" }, "\u2795 \u0625\u0636\u0627\u0641\u0629 \u0648\u062A\u0639\u064A\u064A\u0646 \u0644\u062C\u0646\u0629 \u0631\u0642\u0627\u0628\u064A\u0629 \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setShowAddTeamModal(false),
      className: "p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-4.5 h-4.5" })
  )), /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleCreateTeam, className: "space-y-4 text-xs font-bold text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "\u0645\u062B\u0627\u0644: \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629 \u0627\u0644\u0631\u0627\u0628\u0639\u0629",
      value: newTeamName,
      onChange: (e) => setNewTeamName(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A / \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      disabled: true,
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 outline-none text-xs font-bold opacity-80 cursor-not-allowed"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" }, "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629 (\u0631\u0642\u0627\u0628\u0629 \u0648\u062A\u0641\u062A\u064A\u0634 \u0645\u064A\u062F\u0627\u0646\u064A)")
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u064A \u0627\u0644\u0639\u0627\u0645"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: generalScope,
      onChange: (e) => setGeneralScope(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold focus:border-teal-500"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "mosul" }, "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 (\u0627\u0644\u0645\u0648\u0635\u0644)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "districts" }, "\u0623\u0642\u0636\u064A\u0629 \u0648\u0646\u0648\u0627\u062D\u064A \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629")
  )), generalScope === "mosul" ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u062C\u0627\u0646\u0628"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: mosulSide,
      onChange: (e) => setMosulSide(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold focus:border-teal-500"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "left" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "right" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646")
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u062D\u064A \u0627\u0644\u0633\u0643\u0646\u064A / \u0627\u0644\u0642\u0637\u0627\u0639"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "\u0645\u062B\u0627\u0644: \u0627\u0644\u0632\u0647\u0648\u0631\u060C \u0627\u0644\u063A\u0632\u0644\u0627\u0646\u064A",
      value: mosulNeighborhood,
      onChange: (e) => setMosulNeighborhood(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ))) : /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0642\u0636\u0627\u0621"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "\u0645\u062B\u0627\u0644: \u062A\u0644\u0639\u0641\u0631\u060C \u0627\u0644\u062D\u0645\u062F\u0627\u0646\u064A\u0629",
      value: districtName,
      onChange: (e) => setDistrictName(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0646\u0627\u062D\u064A\u0629 / \u0627\u0644\u062D\u064A"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "\u0645\u062B\u0627\u0644: \u0631\u0628\u064A\u0639\u0629\u060C \u062D\u0645\u0627\u0645 \u0627\u0644\u0639\u0644\u064A\u0644",
      value: districtSubsector,
      onChange: (e) => setDistrictSubsector(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "email",
      required: true,
      placeholder: "team@ninveh.health.gov.iq",
      value: newTeamEmail,
      onChange: (e) => setNewTeamEmail(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500 text-left dir-ltr"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u0644\u062C\u0646\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "077xxxxxxxx",
      value: newTeamPhone,
      onChange: (e) => setNewTeamPhone(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0634\u0641\u0631\u0629 \u0644\u0644\u062C\u0646\u0629"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: showNewTeamPass ? "text" : "password",
      required: true,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      value: newTeamPass,
      onChange: (e) => setNewTeamPass(e.target.value),
      className: "w-full p-2.5 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowNewTeamPass(!showNewTeamPass),
      className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
    },
    showNewTeamPass ? /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Eye, { className: "w-4 h-4" })
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "pt-3 border-t border-slate-800 space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[11px] text-teal-400 block mb-1" }, "\u{1F6E1}\uFE0F \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u062D\u0633\u0627\u0628 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629:"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[9px] text-slate-400 leading-relaxed" }, '\u062A\u0646\u0648\u064A\u0647: \u0633\u064A\u062A\u0645 \u0645\u0646\u062D \u0647\u0630\u0627 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 (\u0625\u0636\u0627\u0641\u0629 \u0648\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0646\u0634\u0622\u062A) \u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0627\u064B. \u064A\u0645\u0643\u0646\u0643 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0628\u0634\u0643\u0644 \u062F\u0642\u064A\u0642 (\u0645\u062B\u0644 \u0645\u0646\u062D \u0625\u0630\u0646 \u0627\u0644\u062D\u0630\u0641) \u0645\u0646 \u062E\u0644\u0627\u0644 \u062E\u064A\u0627\u0631 "\u0627\u0644\u0623\u0630\u0648\u0646\u0627\u062A" \u0641\u064A \u062C\u062F\u0648\u0644 \u0627\u0644\u0644\u062C\u0627\u0646 \u0628\u0639\u062F \u0627\u0644\u0625\u0646\u0634\u0627\u0621.')), generalScope === "mosul" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "mt-3 p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[9px] text-teal-400 text-center font-bold" }, "(\u062A\u0646\u0628\u064A\u0647: \u0647\u0630\u0627 \u0627\u0644\u0641\u0631\u064A\u0642 \u064A\u062A\u0628\u0639 \u0625\u062F\u0627\u0631\u064A\u0627\u064B \u0644\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0623\u064A\u0633\u0631/\u0627\u0644\u0623\u064A\u0645\u0646 \u0627\u0644\u062D\u0627\u0644\u064A \u0641\u064A \u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062F\u064A\u0646\u0629)"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "pt-3 border-t border-slate-800 space-y-3" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[11px] text-teal-400 block mb-2" }, "\u{1F465} \u0643\u0627\u062F\u0631 \u0648\u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629:"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u062D\u0645\u0644\u0629 \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0637\u0628 \u0627\u0644\u0628\u0634\u0631\u064A (\u062F\u0643\u062A\u0648\u0631)"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("doc"), className: "p-1 rounded bg-teal-500/10 text-teal-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u062F\u0643\u062A\u0648\u0631")), doctors.map((doc, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062F\u0643\u062A\u0648\u0631 \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: doc,
      onChange: (e) => handleFieldChange("doc", idx, e.target.value),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), doctors.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("doc", idx), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0645\u0633\u0627\u0639\u062F \u062F\u0643\u062A\u0648\u0631 / \u0643\u0627\u062F\u0631 \u062A\u0645\u0631\u064A\u0636\u064A \u0635\u062D\u064A"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("asst"), className: "p-1 rounded bg-blue-500/10 text-blue-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u0627\u0639\u062F")), assistants.map((asst, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: asst,
      onChange: (e) => handleFieldChange("asst", idx, e.target.value),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), assistants.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("asst", idx), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A / \u0645\u0641\u062A\u0634 \u0633\u0644\u0627\u0645\u0629 \u0628\u064A\u0626\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("tech"), className: "p-1 rounded bg-amber-500/10 text-amber-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A")), technicians.map((tech, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0644\u0627\u062D\u0638 \u0627\u0644\u0641\u0646\u064A \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: tech,
      onChange: (e) => handleFieldChange("tech", idx, e.target.value),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), technicians.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("tech", idx), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" })))))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
    },
    "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0644\u062C\u0646\u0629"
  )))), showEditTeamModal && editingTeam && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-teal-400" }, "\u{1F4DD} \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u062D\u0633\u0627\u0628 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => {
        setShowEditTeamModal(false);
        setEditingTeam(null);
      },
      className: "p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-4.5 h-4.5" })
  )), /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleEditTeamSubmit, className: "space-y-4 text-xs font-bold text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingTeam.name,
      onChange: (e) => setEditingTeam({ ...editingTeam, name: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A \u0627\u0644\u0645\u0639\u064A\u0646"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: editingTeam.sector,
      onChange: (e) => setEditingTeam({ ...editingTeam, sector: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u0632\u0647\u0648\u0631" }, "\u0642\u0637\u0627\u0639 \u0627\u0644\u0632\u0647\u0648\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u0645\u0635\u0627\u0631\u0641" }, "\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0635\u0627\u0631\u0641"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u063A\u0632\u0644\u0627\u0646\u064A" }, "\u0642\u0637\u0627\u0639 \u0627\u0644\u063A\u0632\u0644\u0627\u0646\u064A"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646" }, "\u0642\u0637\u0627\u0639 \u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "email",
      required: true,
      value: editingTeam.email,
      onChange: (e) => setEditingTeam({ ...editingTeam, email: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold text-left dir-ltr focus:border-teal-500"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u0644\u062C\u0646\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingTeam.phone,
      onChange: (e) => setEditingTeam({ ...editingTeam, phone: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-xs font-bold focus:border-teal-500"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-300 block mb-1" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0634\u0641\u0631\u0629 \u0644\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: showNewTeamPass ? "text" : "password",
      placeholder: "\u0627\u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
      value: editingTeam.password || "",
      onChange: (e) => setEditingTeam({ ...editingTeam, password: e.target.value }),
      className: "w-full p-2.5 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowNewTeamPass(!showNewTeamPass),
      className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
    },
    showNewTeamPass ? /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Eye, { className: "w-4 h-4" })
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "pt-3 border-t border-slate-800 space-y-3" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[11px] text-teal-400 block mb-2" }, "\u{1F465} \u062A\u0639\u062F\u064A\u0644 \u0643\u0627\u062F\u0631 \u0627\u0644\u0644\u062C\u0646\u0629 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u062D\u0645\u0644\u0629 \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0637\u0628 \u0627\u0644\u0628\u0634\u0631\u064A (\u062F\u0643\u062A\u0648\u0631)"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("doc", true), className: "p-1 rounded bg-teal-500/10 text-teal-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u062F\u0643\u062A\u0648\u0631")), editDoctors.map((doc, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062F\u0643\u062A\u0648\u0631 \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: doc,
      onChange: (e) => handleFieldChange("doc", idx, e.target.value, true),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), editDoctors.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("doc", idx, true), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0645\u0633\u0627\u0639\u062F \u062F\u0643\u062A\u0648\u0631 / \u0643\u0627\u062F\u0631 \u062A\u0645\u0631\u064A\u0636\u064A \u0635\u062D\u064A"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("asst", true), className: "p-1 rounded bg-blue-500/10 text-blue-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u0627\u0639\u062F")), editAssistants.map((asst, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: asst,
      onChange: (e) => handleFieldChange("asst", idx, e.target.value, true),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), editAssistants.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("asst", idx, true), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-400" }, "\u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A / \u0645\u0641\u062A\u0634 \u0633\u0644\u0627\u0645\u0629 \u0628\u064A\u0626\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => addField("tech", true), className: "p-1 rounded bg-amber-500/10 text-amber-400 text-[10px] flex items-center gap-1 cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Plus, { className: "w-3 h-3" }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0644\u0627\u062D\u0638 \u0641\u0646\u064A")), editTechnicians.map((tech, idx) => /* @__PURE__ */ import_react5.default.createElement("div", { key: idx, className: "flex gap-2 items-center" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0644\u0627\u062D\u0638 \u0627\u0644\u0641\u0646\u064A \u0627\u0644\u0643\u0627\u0645\u0644...",
      value: tech,
      onChange: (e) => handleFieldChange("tech", idx, e.target.value, true),
      className: "flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-[10px]"
    }
  ), editTechnicians.length > 1 && /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => removeField("tech", idx, true), className: "p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Trash2, { className: "w-4.5 h-4.5" })))))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
    },
    "\u062D\u0641\u0638 \u0648\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629"
  )))), showAddDirectorModal && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-teal-400" }, "\u{1F4BC} \u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0639\u064A\u064A\u0646 \u062D\u0633\u0627\u0628 \u0642\u064A\u0627\u062F\u064A/\u0645\u062F\u064A\u0631 \u062C\u062F\u064A\u062F"), /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => setShowAddDirectorModal(false), className: "p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-5 h-5" }))), /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleCreateDirector, className: "space-y-4 text-xs font-bold" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "\u0645\u062B\u0627\u0644: \u062F. \u0639\u0645\u0627\u062F \u0645\u062D\u0645\u062F \u0639\u0628\u062F \u0627\u0644\u0644\u0647",
      value: newDirName,
      onChange: (e) => setNewDirName(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0646\u0638\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0642\u064A\u0627\u062F\u064A"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: newDirRole,
      onChange: (e) => {
        setNewDirRole(e.target.value);
        if (e.target.value === "director") {
          setNewDirTitle("\u0645\u062F\u064A\u0631 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649");
        } else if (e.target.value === "public_health") {
          setNewDirTitle("\u0645\u062F\u064A\u0631 \u0642\u0633\u0645 \u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629");
        } else {
          setNewDirTitle("\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629");
        }
      },
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-teal-500 font-bold"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "director" }, "\u0645\u062F\u064A\u0631 \u0639\u0627\u0645 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649 (Director General)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "public_health" }, "\u0645\u062F\u064A\u0631 \u0642\u0633\u0645 \u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 (Public Health Director)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "director_committee" }, "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 (Sector Chief)")
  )), newDirRole === "director_committee" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3 animate-fadeIn" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-teal-400 block font-black" }, "\u{1F5FA}\uFE0F \u0627\u0644\u0646\u0637\u0627\u0642 \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A \u0627\u0644\u0645\u0639\u064A\u0646 \u0644\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0646\u0637\u0627\u0642"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: newDirScope,
      onChange: (e) => setNewDirScope(e.target.value),
      className: "w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "centre" }, "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062F\u064A\u0646\u0629"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "districts" }, "\u0623\u0642\u0636\u064A\u0629 \u0648\u0646\u0648\u0627\u062D\u064A")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u062C\u0627\u0646\u0628/\u0627\u0644\u0636\u0641\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: newDirSide,
      onChange: (e) => setNewDirSide(e.target.value),
      className: "w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "left" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0633\u0631"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "right" }, "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0623\u064A\u0645\u0646")
  )))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "email",
      required: true,
      placeholder: "director@ninveh.health.gov.iq",
      value: newDirEmail,
      onChange: (e) => setNewDirEmail(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-left dir-ltr"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "07700000000",
      value: newDirPhone,
      onChange: (e) => setNewDirPhone(e.target.value),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-left dir-ltr"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0634\u0641\u0631\u0629 \u0644\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: showNewDirPass ? "text" : "password",
      required: true,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      value: newDirPass,
      onChange: (e) => setNewDirPass(e.target.value),
      className: "w-full p-2.5 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowNewDirPass(!showNewDirPass),
      className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
    },
    showNewDirPass ? /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Eye, { className: "w-4 h-4" })
  ))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
    },
    "\u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0641\u0639\u064A\u0644 \u062D\u0633\u0627\u0628 \u0627\u0644\u0642\u064A\u0627\u062F\u0629"
  )))), showEditDirectorModal && editingDirector && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-blue-400" }, "\u{1F4DD} \u062A\u0639\u062F\u064A\u0644 \u062D\u0633\u0627\u0628 \u0627\u0644\u0642\u064A\u0627\u062F\u064A/\u0627\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => {
    setShowEditDirectorModal(false);
    setEditingDirector(null);
  }, className: "p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-5 h-5" }))), /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleEditDirectorSubmit, className: "space-y-4 text-xs font-bold" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingDirector.name,
      onChange: (e) => setEditingDirector({ ...editingDirector, name: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A / \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      value: editingDirector.title,
      onChange: (e) => setEditingDirector({ ...editingDirector, title: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-teal-500 font-bold"
    },
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0645\u062F\u064A\u0631 \u0639\u0627\u0645 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649" }, "\u0645\u062F\u064A\u0631 \u0639\u0627\u0645 \u0635\u062D\u0629 \u0646\u064A\u0646\u0648\u0649 (Director General)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0645\u062F\u064A\u0631 \u0642\u0633\u0645 \u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629" }, "\u0645\u062F\u064A\u0631 \u0642\u0633\u0645 \u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 (Public Health Director)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629" }, "\u0645\u062F\u064A\u0631 \u0634\u0639\u0628\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 (Sector Chief)"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0645\u062F\u064A\u0631 \u0646\u0627\u062D\u064A\u0629" }, "\u0645\u062F\u064A\u0631 \u0646\u0627\u062D\u064A\u0629"),
    /* @__PURE__ */ import_react5.default.createElement("option", { value: "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629" }, "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629")
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0648\u0632\u0627\u0631\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "email",
      required: true,
      value: editingDirector.email,
      onChange: (e) => setEditingDirector({ ...editingDirector, email: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-left dir-ltr"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingDirector.phone,
      onChange: (e) => setEditingDirector({ ...editingDirector, phone: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none text-left dir-ltr"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0634\u0641\u0631\u0629 \u0644\u0644\u062D\u0633\u0627\u0628"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: showNewDirPass ? "text" : "password",
      placeholder: "\u0627\u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
      value: editingDirector.password || "",
      onChange: (e) => setEditingDirector({ ...editingDirector, password: e.target.value }),
      className: "w-full p-2.5 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowNewDirPass(!showNewDirPass),
      className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
    },
    showNewDirPass ? /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Eye, { className: "w-4 h-4" })
  ))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
    },
    "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629"
  )))), editingEst && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-blue-400" }, "\u{1F4DD} \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0627\u0644\u0635\u062D\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => setEditingEst(null), className: "p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-5 h-5" }))), /* @__PURE__ */ import_react5.default.createElement("form", { onSubmit: handleEditEstSubmit, className: "space-y-4 text-xs font-bold" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 / \u0627\u0644\u0645\u0637\u0639\u0645"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.name,
      onChange: (e) => setEditingEst({ ...editingEst, name: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0635\u0646\u0641 \u0627\u0644\u0646\u0634\u0627\u0637"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.type,
      onChange: (e) => setEditingEst({ ...editingEst, type: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0627\u0644\u0643 \u0627\u0644\u0643\u0627\u0645\u0644"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.owner,
      onChange: (e) => setEditingEst({ ...editingEst, owner: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u0627\u0644\u0643"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.phone,
      onChange: (e) => setEditingEst({ ...editingEst, phone: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400" }, "\u0631\u0642\u0645 \u0627\u0644\u0625\u062C\u0627\u0632\u0629 \u0627\u0644\u0635\u062D\u064A\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.licenseNumber,
      onChange: (e) => setEditingEst({ ...editingEst, licenseNumber: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "text-slate-400 font-bold block mb-1" }, "\u0627\u0644\u0642\u0637\u0627\u0639 \u0648\u0627\u0644\u062D\u064A \u0627\u0644\u0633\u0643\u0646\u064A"), /* @__PURE__ */ import_react5.default.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: editingEst.sector,
      onChange: (e) => setEditingEst({ ...editingEst, sector: e.target.value }),
      className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
    }
  )), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
    },
    "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629"
  )))), selectedEstDetails && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-teal-400" }, "\u{1F517} \u0631\u0645\u0632 \u0627\u0644\u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 QR \u0648\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u0634\u0623\u0629"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setSelectedEstDetails(null),
      className: "p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-4 h-4" })
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-4 text-xs" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "p-4 rounded-2xl bg-slate-850 border border-slate-800 text-right space-y-1.5" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-teal-400 block font-black uppercase" }, "\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0644\u0644\u0645\u0646\u0634\u0623\u0629"), /* @__PURE__ */ import_react5.default.createElement("h4", { className: "text-sm font-black text-white" }, selectedEstDetails.name), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0627\u0644\u0646\u0634\u0627\u0637: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: "text-slate-100" }, selectedEstDetails.type)), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0627\u0644\u0645\u0627\u0644\u0643: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: "text-slate-100" }, selectedEstDetails.owner)), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: "text-slate-100" }, selectedEstDetails.phone)), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0627\u0644\u062A\u0631\u062E\u064A\u0635: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: "text-slate-100" }, selectedEstDetails.licenseNumber)), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0622\u062E\u0631 \u0632\u064A\u0627\u0631\u0629 \u062A\u0641\u062A\u064A\u0634: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: "text-slate-200" }, selectedEstDetails.lastInspection)), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[10.5px] text-slate-300" }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645: ", /* @__PURE__ */ import_react5.default.createElement("strong", { className: selectedEstDetails.score >= 90 ? "text-teal-400" : "text-amber-500" }, selectedEstDetails.lastInspection === "\u0644\u0645 \u064A\u0632\u0631 \u0628\u0639\u062F" ? "\u0645\u0639\u0644\u0642" : `${selectedEstDetails.score}%`))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-700 shadow-inner" }, /* @__PURE__ */ import_react5.default.createElement(
    "img",
    {
      src: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`,
      alt: "Restaurant QR Code",
      className: "w-48 h-48 block border border-slate-100 shadow-sm rounded-lg"
    }
  ), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[10px] text-slate-500 font-extrabold mt-3 text-center block" }, "\u0643\u0648\u062F QR \u0627\u0644\u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0646\u0634\u0623\u0629 (\u064A\u0639\u0631\u0636 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0635\u062D\u064A \u0648\u064A\u0645\u0643\u0646 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 \u0645\u0646 \u0627\u0644\u0625\u0628\u0644\u0627\u063A)")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "grid grid-cols-2 gap-3 pt-2" }, /* @__PURE__ */ import_react5.default.createElement(
    "a",
    {
      href: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`,
      target: "_blank",
      rel: "noreferrer",
      className: "py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-center font-black block transition-all active:scale-[0.98]"
    },
    "\u{1F4E5} \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0648\u0631\u0629"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => window.print(),
      className: "py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-center font-black block transition-all active:scale-[0.98]"
    },
    "\u{1F5A8}\uFE0F \u0637\u0628\u0627\u0639\u0629 \u0645\u0644\u0635\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F"
  )), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => setSelectedEstDetails(null),
      className: "mt-4 w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 font-extrabold transition-all"
    },
    "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0646\u0627\u0641\u0630\u0629"
  )))), showPermissionsModal && selectedPermissionsAccount && /* @__PURE__ */ import_react5.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-sm font-black text-purple-400 flex items-center gap-2" }, /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.Settings, { className: "w-4.5 h-4.5" }), "\u0646\u0638\u0627\u0645 \u0627\u0644\u0623\u0630\u0648\u0646\u0627\u062A \u0627\u0644\u062F\u0642\u064A\u0642 (Granular Permissions)"), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setShowPermissionsModal(false),
      className: "p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_lucide_react3.X, { className: "w-4.5 h-4.5" })
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "mb-4" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[11px] text-slate-400 block" }, "\u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641:"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-sm font-black text-white" }, selectedPermissionsAccount.name)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-6 max-h-[60vh] overflow-y-auto pr-1 pb-4" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-xs font-black text-teal-400 border-b border-slate-700/50 pb-2" }, "\u0623. \u0623\u0630\u0648\u0646\u0627\u062A \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0634\u0622\u062A"), [
    { key: "manageEstablishments", title: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0634\u0622\u062A (\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u0627\u0644\u0631\u0626\u064A\u0633\u064A)", desc: "\u064A\u0638\u0647\u0631 \u0623\u0648 \u064A\u062E\u0641\u064A \u0642\u0633\u0645 \u0627\u0644\u0645\u0646\u0634\u0622\u062A \u0628\u0627\u0644\u0643\u0627\u0645\u0644." },
    { key: "createEst", title: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u0634\u0623\u0629 \u062C\u062F\u064A\u062F\u0629", desc: "\u064A\u0633\u0645\u062D \u0628\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0637\u0627\u0639\u0645 \u0648\u0627\u0644\u0645\u0642\u0627\u0647\u064A \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0628\u0627\u0644\u0646\u0638\u0627\u0645." },
    { key: "editEst", title: "\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0623\u0629", desc: "\u064A\u0633\u0645\u062D \u0628\u062A\u062D\u062F\u064A\u062B \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0648\u0627\u0644\u062A\u0631\u062E\u064A\u0635 \u0644\u0644\u0645\u0637\u0639\u0645." },
    { key: "deleteEst", title: "\u062D\u0630\u0641 \u0645\u0646\u0634\u0623\u0629 \u0646\u0647\u0627\u0626\u064A\u0627\u064B", desc: "\u0625\u0630\u0646 \u062E\u0637\u064A\u0631: \u064A\u0633\u0645\u062D \u0628\u0634\u0637\u0628 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A." },
    { key: "addEval", title: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0642\u064A\u064A\u0645/\u0643\u0634\u0641 \u0635\u062D\u064A", desc: "\u064A\u0633\u0645\u062D \u0628\u0625\u062C\u0631\u0627\u0621 \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u0635\u062D\u064A \u0648\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645." }
  ].map((perm) => /* @__PURE__ */ import_react5.default.createElement("div", { key: perm.key, onClick: () => togglePermission(perm.key), className: "flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col flex-1 pl-4" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-black text-slate-200" }, perm.title), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 mt-1" }, perm.desc)), /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "bg-purple-600" : "bg-slate-600"}` }, /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "left-1" : "left-[22px]"}` }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-xs font-black text-blue-400 border-b border-slate-700/50 pb-2" }, "\u0628. \u0623\u0630\u0648\u0646\u0627\u062A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645"), [
    { key: "showMainDashboard", title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", desc: "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0644\u062E\u0635 \u0648\u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A." },
    { key: "showReportsPage", title: "\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", desc: "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0648\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A\u0629." },
    { key: "showDirectivesPage", title: "\u0635\u0641\u062D\u0629 \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A", desc: "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0631\u0627\u0633\u0644\u0627\u062A \u0648\u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A." },
    { key: "showDeliveryPage", title: "\u0635\u0641\u062D\u0629 \u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644", desc: "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0635\u0641\u062D\u0629 \u0625\u062F\u0627\u0631\u0629 \u0639\u0645\u0627\u0644 \u0627\u0644\u062A\u0648\u0635\u064A\u0644." },
    { key: "showPublicEvalsPage", title: "\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629", desc: "\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0635\u0641\u062D\u0629 \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0645\u0648\u0627\u0637\u0646\u064A\u0646." }
  ].map((perm) => /* @__PURE__ */ import_react5.default.createElement("div", { key: perm.key, onClick: () => togglePermission(perm.key), className: "flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col flex-1 pl-4" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-black text-slate-200" }, perm.title), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 mt-1" }, perm.desc)), /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "bg-purple-600" : "bg-slate-600"}` }, /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "left-1" : "left-[22px]"}` }))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-xs font-black text-amber-400 border-b border-slate-700/50 pb-2" }, "\u062C. \u0623\u0630\u0648\u0646\u0627\u062A \u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u0628\u0644\u064A\u063A\u0627\u062A"), [
    { key: "sendDirective", title: "\u0635\u0644\u0627\u062D\u064A\u0629 \u0625\u0631\u0633\u0627\u0644 \u062A\u0628\u0644\u064A\u063A", desc: "\u064A\u0633\u0645\u062D \u0628\u0625\u0646\u0634\u0627\u0621 \u0648\u0625\u0631\u0633\u0627\u0644 \u0623\u0648\u0627\u0645\u0631 \u0648\u062A\u0628\u0644\u064A\u063A\u0627\u062A \u062C\u062F\u064A\u062F\u0629." },
    { key: "replyDirective", title: "\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0631\u062F \u0639\u0644\u0649 \u0627\u0644\u062A\u0628\u0644\u064A\u063A\u0627\u062A", desc: "\u064A\u0633\u0645\u062D \u0628\u0627\u0644\u0631\u062F \u0639\u0644\u0649 \u0627\u0644\u062A\u0628\u0644\u064A\u063A\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629." }
  ].map((perm) => /* @__PURE__ */ import_react5.default.createElement("div", { key: perm.key, onClick: () => togglePermission(perm.key), className: "flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col flex-1 pl-4" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-xs font-black text-slate-200" }, perm.title), /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[9px] text-slate-400 mt-1" }, perm.desc)), /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "bg-purple-600" : "bg-slate-600"}` }, /* @__PURE__ */ import_react5.default.createElement("div", { className: `w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${!!selectedPermissionsAccount.permissions?.[perm.key] ? "left-1" : "left-[22px]"}` })))), /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[9px] text-slate-500 mt-2 px-2" }, '* \u062A\u0646\u0648\u064A\u0647: \u0641\u064A \u062D\u0627\u0644 \u0625\u0637\u0641\u0627\u0621 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0648\u0627\u0644\u0631\u062F\u060C \u064A\u0643\u062A\u0633\u0628 \u0627\u0644\u062D\u0633\u0627\u0628 "\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629 \u0641\u0642\u0637" \u0644\u0644\u062A\u0628\u0644\u064A\u063A\u0627\u062A \u0627\u0644\u0645\u0648\u062C\u0647\u0629 \u0644\u0647.'))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "mt-6 flex flex-col gap-2" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: handleSavePermissions,
      className: "w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all cursor-pointer"
    },
    "\u062D\u0641\u0638 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setShowPermissionsModal(false),
      className: "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
    },
    "\u0625\u063A\u0644\u0627\u0642 \u0648\u062E\u0631\u0648\u062C"
  )))), accountModalState.isOpen && /* @__PURE__ */ import_react5.default.createElement(
    AccountModal,
    {
      isOpen: accountModalState.isOpen,
      mode: accountModalState.mode,
      initialData: accountModalState.data,
      onClose: () => setAccountModalState({ isOpen: false, mode: "add", data: null }),
      onSave: handleSaveAccount
    }
  ));
};

// test-compile.jsx
console.log("SuperAdminPanel is:", typeof SuperAdminPanel);
