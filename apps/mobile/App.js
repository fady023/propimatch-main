"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var native_1 = require("@react-navigation/native");
var native_stack_1 = require("@react-navigation/native-stack");
var bottom_tabs_1 = require("@react-navigation/bottom-tabs");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ui_1 = require("./src/components/ui");
var data_1 = require("@propimatch/data");
function SplashScreen(_a) {
    var navigation = _a.navigation;
    react_1.default.useEffect(function () {
        var t = setTimeout(function () { return navigation.replace('Onboarding'); }, 800);
        return function () { return clearTimeout(t); };
    }, [navigation]);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center bg-[#0B1215]", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-16 w-16 rounded-2xl", style: { backgroundColor: '#0E5D6C' } }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mt-3 text-xl text-white", children: "Propimatch" })] }));
}
function OnboardingScreen(_a) {
    var navigation = _a.navigation;
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center bg-[#0B1215] px-6", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mb-4 text-xl text-white", children: "Welcome to Propimatch" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { title: "Get Started", onPress: function () { return navigation.replace('Auth'); } })] }));
}
function LoginScreen(_a) {
    var navigation = _a.navigation;
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center bg-[#0B1215] gap-3 px-6", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: "Login" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Email" }), (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Password" }), (0, jsx_runtime_1.jsx)(ui_1.Button, { title: "Continue", onPress: function () { return navigation.replace('Main'); } })] }));
}
function ChatScreen() {
    var _a = react_1.default.useState([
        { role: 'assistant', content: 'Hi! Tell me about the property you want to buy or rent.' }
    ]), messages = _a[0], setMessages = _a[1];
    var _b = react_1.default.useState('Looking for a 2BR in Marina under 8k'), input = _b[0], setInput = _b[1];
    var _c = react_1.default.useState(false), loading = _c[0], setLoading = _c[1];
    var send = function () {
        if (!input.trim())
            return;
        var next = __spreadArray(__spreadArray([], messages, true), [{ role: 'user', content: input }], false);
        setMessages(next);
        setInput('');
        setLoading(true);
        var reply = 'Great! I found 3 matches. Check your Requests.';
        var i = 0;
        var t = setInterval(function () {
            i += 2;
            setMessages(function (m) {
                var base = m.filter(function (_, idx) { return idx < next.length; });
                return __spreadArray(__spreadArray([], base, true), [{ role: 'assistant', content: reply.slice(0, i) }], false);
            });
            if (i >= reply.length) {
                clearInterval(t);
                setLoading(false);
            }
        }, 30);
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-2", children: [messages.map(function (m, idx) { return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex ".concat(m.role === 'user' ? 'items-end' : 'items-start'), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "max-w-[85%] rounded-2xl px-3 py-2 ".concat(m.role === 'user' ? 'bg-[#0E5D6C]' : 'bg-[#101A1F] border border-[#1F2B33]', " "), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: m.content }) }) }, idx)); }), loading && (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs text-[#A7BBC2]", children: "Assistant is typing\u2026" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1", children: (0, jsx_runtime_1.jsx)(ui_1.Input, { placeholder: "Describe your needs\u2026", value: input, onChangeText: setInput }) }), (0, jsx_runtime_1.jsx)(ui_1.Button, { title: "Send", onPress: send })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: ['2BR Marina under 8k', 'Townhouse in Abu Dhabi', 'Studio near Metro'].map(function (c) { return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: function () { return setInput(c); }, className: "rounded-full border border-[#1F2B33] px-3 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2] text-xs", children: c }) }, c)); }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "mt-1 flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: function () { var _a, _b; return setInput((_b = (_a = messages[messages.length - 1]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ''); }, className: "rounded-lg border border-[#1F2B33] px-2 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2] text-xs", children: "Regenerate" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: function () { }, className: "rounded-lg border border-[#1F2B33] px-2 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2] text-xs", children: "Copy" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "rounded-lg border border-[#1F2B33] px-2 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2] text-xs", children: "\uD83D\uDC4D" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "rounded-lg border border-[#1F2B33] px-2 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2] text-xs", children: "\uD83D\uDC4E" }) })] })] })] }));
}
function ListingRow(_a) {
    var title = _a.title, img = _a.img, subtitle = _a.subtitle;
    return ((0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "mb-3 flex-row items-center gap-3 p-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: img }, className: "h-16 w-24 rounded-lg" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2]", children: subtitle })] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { title: "Shortlist", variant: "outline" })] }));
}
function RequestsScreen() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mb-3 text-lg text-white", children: "Your Requests" }), (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: data_1.requests, keyExtractor: function (r) { return r.id; }, renderItem: function (_a) {
                    var item = _a.item;
                    return ((0, jsx_runtime_1.jsxs)(ui_1.Card, { className: "mb-3 p-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-white", children: [item.type.toUpperCase(), " \u2022 ", item.location] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-[#A7BBC2]", children: ["Budget: ", item.budget, " AED"] })] }));
                } })] }));
}
function ListingsScreen() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mb-3 text-lg text-white", children: "Your Listings" }), (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: data_1.listings, keyExtractor: function (l) { return l.id; }, renderItem: function (_a) {
                    var item = _a.item;
                    return ((0, jsx_runtime_1.jsx)(ListingRow, { title: item.title, subtitle: "".concat(item.location, " \u2022 ").concat(item.bedrooms, "BR"), img: item.images[0] }));
                } })] }));
}
function MatchResultsScreen() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mb-3 text-lg text-white", children: "Matches" }), (0, jsx_runtime_1.jsx)(ui_1.Card, { className: "h-64 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2]", children: "Map placeholder" }) }), (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: data_1.listings, keyExtractor: function (l) { return l.id; }, renderItem: function (_a) {
                    var item = _a.item;
                    return ((0, jsx_runtime_1.jsx)(ListingRow, { title: item.title, subtitle: "".concat(item.location, " \u2022 ").concat(item.bedrooms, "BR"), img: item.images[0] }));
                } })] }));
}
function PropertyDetailScreen() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "mb-2 text-xl text-white", children: "Property Detail" }), (0, jsx_runtime_1.jsx)(ui_1.Card, { className: "mb-3 h-48 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[#A7BBC2]", children: "Image carousel placeholder" }) }), (0, jsx_runtime_1.jsx)(ui_1.Button, { title: "Schedule Viewing" })] }));
}
function InboxScreen() { return (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: "Inbox" }) }); }
function NotificationsScreen() { return (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: "Notifications" }) }); }
function WalletScreen() { return (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: "Wallet" }) }); }
function ProfileScreen() { return (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-[#0B1215] p-4", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: "Profile" }) }); }
var Stack = (0, native_stack_1.createNativeStackNavigator)();
var Tab = (0, bottom_tabs_1.createBottomTabNavigator)();
function MainTabs() {
    return ((0, jsx_runtime_1.jsxs)(Tab.Navigator, { screenOptions: function (_a) {
            var route = _a.route;
            return ({
                tabBarIcon: function (_a) {
                    var color = _a.color, size = _a.size;
                    var map = {
                        Chat: 'chatbubbles',
                        Requests: 'home',
                        Matches: 'map',
                        Inbox: 'mail',
                        Alerts: 'notifications',
                        Wallet: 'wallet',
                        Profile: 'person'
                    };
                    var name = map[route.name];
                    return (0, jsx_runtime_1.jsx)(vector_icons_1.Ionicons, { name: name, size: size, color: color });
                },
                tabBarActiveTintColor: '#0E5D6C',
                tabBarInactiveTintColor: '#9AA9AF',
                headerShown: false,
                tabBarStyle: { backgroundColor: '#0B1215', borderTopColor: '#1F2B33' }
            });
        }, children: [(0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Chat", component: ChatScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Requests", component: RequestsScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Matches", component: MatchResultsScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Inbox", component: InboxScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Alerts", component: NotificationsScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Wallet", component: WalletScreen }), (0, jsx_runtime_1.jsx)(Tab.Screen, { name: "Profile", component: ProfileScreen })] }));
}
function App() {
    var scheme = (0, react_native_1.useColorScheme)();
    return ((0, jsx_runtime_1.jsx)(native_1.NavigationContainer, { theme: scheme === 'dark' ? native_1.DarkTheme : native_1.DefaultTheme, children: (0, jsx_runtime_1.jsxs)(Stack.Navigator, { screenOptions: { headerShown: false }, children: [(0, jsx_runtime_1.jsx)(Stack.Screen, { name: "Splash", component: SplashScreen }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "Onboarding", component: OnboardingScreen }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "Auth", component: LoginScreen }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "Main", component: MainTabs }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "PropertyDetail", component: PropertyDetailScreen })] }) }));
}
