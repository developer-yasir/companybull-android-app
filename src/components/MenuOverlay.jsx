import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Pressable 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import Ionicons from '../../node_modules/expo/node_modules/@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

export default function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useMenu();
  const { logout, user } = useAuth();
  const router = useRouter();
  
  // Controls if the component is in the UI tree at all
  const [isRendered, setIsRendered] = React.useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sync internal render state with menu open state
  useEffect(() => {
    if (isMenuOpen) {
      console.log('[MENU] Opening...');
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      console.log('[MENU] Closing...');
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -MENU_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          console.log('[MENU] Animation finished. Unmounting.');
          setIsRendered(false);
        }
      });
    }
  }, [isMenuOpen]);

  // Fallback: If menu is closed but still rendered for some reason, kill it.
  // This is a safety valve for the "dark overlay" issue.
  useEffect(() => {
    if (!isMenuOpen) {
      const timer = setTimeout(() => {
        if (isRendered) {
          console.log('[MENU] Safety unmount triggered.');
          setIsRendered(false);
        }
      }, 500); // Wait longer than animation duration
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen, isRendered]);

  const navigateTo = (path) => {
    closeMenu();
    // Small delay to let animation start before the screen changes
    setTimeout(() => {
      router.push(path);
    }, 50);
  };

  const menuItems = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Staff directory', icon: 'people', path: '/employees' },
    { label: 'Org Chart', icon: 'git-network', path: '/org' },
    { label: 'Time Off', icon: 'calendar', path: '/leave' },
    { label: 'My profile', icon: 'person', path: '/profile' },
  ];

  if (!isRendered && !isMenuOpen) return null;

  return (
    <View 
      style={[
        styles.container, 
        { pointerEvents: isMenuOpen ? 'auto' : 'none' }
      ]}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={closeMenu} />
      </Animated.View>

      {/* Slide Menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuHeader}>
          <View style={styles.profileBox}>
             <View style={styles.avatar}>
               <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
             </View>
             <View>
               <Text style={styles.userName}>{user?.name || 'User'}</Text>
               <Text style={styles.userRole}>{user?.role || 'Member'}</Text>
             </View>
          </View>
          <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
             <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContent}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.label} 
              style={styles.menuItem} 
              onPress={() => navigateTo(item.path)}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon} size={20} color="#000" />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logout}>
            <View style={[styles.menuIconBox, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="log-out" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuFooter}>
          <Text style={styles.footerText}>CompanyBull v1.2</Text>
          <Text style={styles.footerRef}>Premium Neo-Brutalism Edition</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#863ceb',
    borderRightWidth: 4,
    borderColor: '#0d0d0d',
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  menuHeader: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#f6d140',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '800',
    color: '#f6d140',
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fdfdfc',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#f6d140',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 20,
  },
  menuFooter: {
    padding: 24,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  footerRef: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f6d140',
  },
});
