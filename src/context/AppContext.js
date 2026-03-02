import React, { createContext, useState, useEffect } from 'react';
import mock from '../mock/data';
import generateUserCode from '../utils/ids';
import { loadJSON, saveJSON } from '../utils/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState(mock.groups);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const [sUser, sGroups] = await Promise.all([loadJSON('app:user'), loadJSON('app:groups')]);
        if (sUser) setUser(sUser);
        if (sGroups) setGroups(sGroups);
      } catch (e) {
        console.warn('Failed to load persisted app state', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist user and groups immediately whenever they change (after hydration).
  // This performs a write on every change. Be aware this increases storage I/O.
  const saveAll = async (u, g) => {
    try {
      await Promise.all([saveJSON('app:user', u), saveJSON('app:groups', g)]);
    } catch (e) {
      console.warn('Failed to persist app state', e);
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    // Immediately save latest user and groups state
    saveAll(user, groups);
  }, [user, groups, hydrated]);

  // flush/persist when the page is being closed (web)
  useEffect(() => {
    const flush = () => {
      // best-effort persist before unload
      saveAll(user, groups);
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('beforeunload', flush);
    }
    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('beforeunload', flush);
      }
    };
  }, [user, groups]);

  const login = (email, name) => {
    // If we already have a user persisted with a code (same email), keep that code so it remains stable.
    const existingCode = user && user.code && user.email === email ? user.code : null;
    const code = existingCode || generateUserCode(name, email);
    const u = { id: user?.id || 'u1', email, name, code };
    setUser(u);
    // ensure user is in mock user list
    return u;
  };

  const createGroup = (title) => {
    const id = 'g-' + Date.now();
    const newGroup = {
      id,
      title,
      members: user ? [user] : [],
      messages: [],
      inviteOnly: true // group must be invite-only
    };
    setGroups((prev) => [newGroup, ...prev]);
    return newGroup;
  };

  const deleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const joinGroupById = (groupId) => {
    // For mock: user can join if group exists and they supply id
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return { success: false, message: 'Group not found' };
    const g = groups[idx];
    // If inviteOnly, in real app you'd require invite; here we just allow join for demo
    if (!g.members.find((m) => m.id === user?.id)) {
      const updated = { ...g, members: [...g.members, user] };
      setGroups((prev) => prev.map((gr) => (gr.id === groupId ? updated : gr)));
    }
    return { success: true, group: { ...g, members: [...g.members, user] } };
  };

  const addMemberToGroup = (groupId, member) => {
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return { success: false, message: 'Group not found' };
    const g = groups[idx];
    if (!g.members.find((m) => m.id === member.id)) {
      const updated = { ...g, members: [...g.members, member] };
      setGroups((prev) => prev.map((gr) => (gr.id === groupId ? updated : gr)));
      return { success: true, group: updated };
    }
    return { success: false, message: 'Member already in group' };
  };

  const sendMessage = (groupId, text) => {
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return;
    const msg = {
      id: 'm-' + Date.now(),
      author: user || { id: 'u-guest', name: 'Guest' },
      text,
      likedGreen: [],
      likedRed: [],
      createdAt: new Date().toISOString()
    };
    const updated = { ...groups[idx], messages: [...groups[idx].messages, msg] };
    setGroups((prev) => prev.map((gr, i) => (i === idx ? updated : gr)));
  };

  const deleteMessage = (groupId, messageId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, messages: g.messages.filter((m) => m.id !== messageId) };
      })
    );
  };

  const clearGreenLikes = (groupId, messageId) => {
    // Remove all green likes from a specific message so it no longer appears in the Calendar
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const msgs = g.messages.map((m) => {
          if (m.id !== messageId) return m;
          return { ...m, likedGreen: [] };
        });
        return { ...g, messages: msgs };
      })
    );
  };

  const clearRedLikes = (groupId, messageId) => {
    // Remove all red likes from a specific message so it no longer appears in the Notes
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const msgs = g.messages.map((m) => {
          if (m.id !== messageId) return m;
          return { ...m, likedRed: [] };
        });
        return { ...g, messages: msgs };
      })
    );
  };

  const toggleReaction = (groupId, messageId, type) => {
    // type: 'green' or 'red'
    // Reactions are independent: a user can like green and/or red separately.
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const msgs = g.messages.map((m) => {
          if (m.id !== messageId) return m;
          const greenArr = m.likedGreen || [];
          const redArr = m.likedRed || [];
          const inGreen = greenArr.find((x) => x.id === user?.id);
          const inRed = redArr.find((x) => x.id === user?.id);

          if (type === 'green') {
            if (inGreen) {
              // remove green (toggle off)
              return { ...m, likedGreen: greenArr.filter((x) => x.id !== user.id) };
            } else {
              // add green (do not touch red)
              return { ...m, likedGreen: [...greenArr, user] };
            }
          }

          if (type === 'red') {
            if (inRed) {
              // remove red (toggle off)
              return { ...m, likedRed: redArr.filter((x) => x.id !== user.id) };
            } else {
              // add red (do not touch green)
              return { ...m, likedRed: [...redArr, user] };
            }
          }

          return m;
        });
        return { ...g, messages: msgs };
      })
    );
  };

  return (
    <AppContext.Provider value={{ user, login, groups, createGroup, joinGroupById, addMemberToGroup, sendMessage, toggleReaction, deleteGroup, deleteMessage, clearGreenLikes, clearRedLikes }}>
      {children}
    </AppContext.Provider>
  );
};
