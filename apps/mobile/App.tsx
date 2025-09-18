import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, useColorScheme, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Input } from './src/components/ui';
import { listings as demoListings, requests as demoRequests } from '@propimatch/data';

function SplashScreen({ navigation }: any) {
  React.useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 800);
    return () => clearTimeout(t);
  }, [navigation]);
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1215]">
      <View className="h-16 w-16 rounded-2xl" style={{ backgroundColor: '#0E5D6C' }} />
      <Text className="mt-3 text-xl text-white">Propimatch</Text>
    </View>
  );
}

function OnboardingScreen({ navigation }: any) {
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1215] px-6">
      <Text className="mb-4 text-xl text-white">Welcome to Propimatch</Text>
      <Button title="Get Started" onPress={() => navigation.replace('Auth')} />
    </View>
  );
}

function LoginScreen({ navigation }: any) {
  return (
    <View className="flex-1 items-center justify-center bg-[#0B1215] gap-3 px-6">
      <Text className="text-white">Login</Text>
      <Input placeholder="Email" />
      <Input placeholder="Password" />
      <Button title="Continue" onPress={() => navigation.replace('Main')} />
    </View>
  );
}

function ChatScreen() {
  const [messages, setMessages] = React.useState<{ role: 'user'|'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! Tell me about the property you want to buy or rent.' }
  ]);
  const [input, setInput] = React.useState('Looking for a 2BR in Marina under 8k');
  const [loading, setLoading] = React.useState(false);

  const send = () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);
    const reply = 'Great! I found 3 matches. Check your Requests.';
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setMessages((m) => {
        const base = m.filter((_, idx) => idx < next.length);
        return [...base, { role: 'assistant', content: reply.slice(0, i) }];
      });
      if (i >= reply.length) {
        clearInterval(t);
        setLoading(false);
      }
    }, 30);
  };

  return (
    <View className="flex-1 bg-[#0B1215] p-4">
      <View className="flex-1 gap-2">
        {messages.map((m, idx) => (
          <View key={idx} className={`flex ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <View className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.role === 'user' ? 'bg-[#0E5D6C]' : 'bg-[#101A1F] border border-[#1F2B33]'} `}>
              <Text className="text-white">{m.content}</Text>
            </View>
          </View>
        ))}
        {loading && <Text className="text-xs text-[#A7BBC2]">Assistant is typing…</Text>}
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1"><Input placeholder="Describe your needs…" value={input} onChangeText={setInput} /></View>
          <Button title="Send" onPress={send} />
        </View>
        <View className="flex-row flex-wrap gap-2">
          {['2BR Marina under 8k','Townhouse in Abu Dhabi','Studio near Metro'].map((c) => (
            <TouchableOpacity key={c} onPress={() => setInput(c)} className="rounded-full border border-[#1F2B33] px-3 py-1">
              <Text className="text-[#A7BBC2] text-xs">{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-1 flex-row items-center gap-2">
          <TouchableOpacity onPress={() => setInput(messages[messages.length-1]?.content ?? '')} className="rounded-lg border border-[#1F2B33] px-2 py-1">
            <Text className="text-[#A7BBC2] text-xs">Regenerate</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} className="rounded-lg border border-[#1F2B33] px-2 py-1">
            <Text className="text-[#A7BBC2] text-xs">Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg border border-[#1F2B33] px-2 py-1">
            <Text className="text-[#A7BBC2] text-xs">👍</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg border border-[#1F2B33] px-2 py-1">
            <Text className="text-[#A7BBC2] text-xs">👎</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ListingRow({ title, img, subtitle }: { title: string; img: string; subtitle: string }) {
  return (
    <Card className="mb-3 flex-row items-center gap-3 p-3">
      <Image source={{ uri: img }} className="h-16 w-24 rounded-lg" />
      <View className="flex-1">
        <Text className="text-white">{title}</Text>
        <Text className="text-[#A7BBC2]">{subtitle}</Text>
      </View>
      <Button title="Shortlist" variant="outline" />
    </Card>
  );
}

function RequestsScreen() {
  return (
    <View className="flex-1 bg-[#0B1215] p-4">
      <Text className="mb-3 text-lg text-white">Your Requests</Text>
      <FlatList
        data={demoRequests}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <Card className="mb-3 p-3">
            <Text className="text-white">{item.type.toUpperCase()} • {item.location}</Text>
            <Text className="text-[#A7BBC2]">Budget: {item.budget} AED</Text>
          </Card>
        )}
      />
    </View>
  );
}

function ListingsScreen() {
  return (
    <View className="flex-1 bg-[#0B1215] p-4">
      <Text className="mb-3 text-lg text-white">Your Listings</Text>
      <FlatList
        data={demoListings}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <ListingRow title={item.title} subtitle={`${item.location} • ${item.bedrooms}BR`} img={item.images[0]} />
        )}
      />
    </View>
  );
}

function MatchResultsScreen() {
  return (
    <View className="flex-1 bg-[#0B1215] p-4">
      <Text className="mb-3 text-lg text-white">Matches</Text>
      <Card className="h-64 items-center justify-center">
        <Text className="text-[#A7BBC2]">Map placeholder</Text>
      </Card>
      <FlatList
        data={demoListings}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <ListingRow title={item.title} subtitle={`${item.location} • ${item.bedrooms}BR`} img={item.images[0]} />
        )}
      />
    </View>
  );
}

function PropertyDetailScreen() {
  return (
    <View className="flex-1 bg-[#0B1215] p-4">
      <Text className="mb-2 text-xl text-white">Property Detail</Text>
      <Card className="mb-3 h-48 items-center justify-center">
        <Text className="text-[#A7BBC2]">Image carousel placeholder</Text>
      </Card>
      <Button title="Schedule Viewing" />
    </View>
  );
}

function InboxScreen() { return <View className="flex-1 bg-[#0B1215] p-4"><Text className="text-white">Inbox</Text></View>; }
function NotificationsScreen() { return <View className="flex-1 bg-[#0B1215] p-4"><Text className="text-white">Notifications</Text></View>; }
function WalletScreen() { return <View className="flex-1 bg-[#0B1215] p-4"><Text className="text-white">Wallet</Text></View>; }
function ProfileScreen() { return <View className="flex-1 bg-[#0B1215] p-4"><Text className="text-white">Profile</Text></View>; }

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, string> = {
            Chat: 'chatbubbles',
            Requests: 'home',
            Matches: 'map',
            Inbox: 'mail',
            Alerts: 'notifications',
            Wallet: 'wallet',
            Profile: 'person'
          };
          const name = map[route.name] as any;
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0E5D6C',
        tabBarInactiveTintColor: '#9AA9AF',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0B1215', borderTopColor: '#1F2B33' }
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Matches" component={MatchResultsScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

