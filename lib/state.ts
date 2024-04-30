import {
	type UserStateTypeRaw,
	type UserStateType,
	type Permissions,
	AllowALL,
} from "~/lib/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Session } from "next-auth";

type StateType = Partial<UserStateTypeRaw>;

type State = {
	userState: StateType;
	session: Session["user"] | null;
	permissions: Permissions;
	login: (session: Session["user"]) => void;
	selectContact: (contact: UserStateTypeRaw["userSelectedContact"]) => void;
	selectTransaction: (
		contact: UserStateTypeRaw["userSelectedTransaction"],
	) => void;
	updateState: (state: Partial<StateType>) => void;
	clearState: () => void;
	updatepermissions: (key: keyof Permissions, value: boolean) => void;
	updateStateInstance: (
		key: keyof StateType,
		value: StateType[typeof key],
	) => void;
};

export const StateManagement = create(
	persist<State>(
		(set) => ({
			userState: {},
			session: null,
			permissions: AllowALL,

			login: (session) => {
				set((state) => ({
					...state,
					session,
				}));
			},
			clearState: () => {
				set((state) => ({
					...state,
					userState: {},
					session: null,
				}));
			},
			selectContact: (contact) => {
				set((state) => ({
					...state,
					userState: {
						...state.userState,
						userSelectedContact: contact,
					},
				}));
			},
			selectTransaction: (contact) => {
				set((state) => ({
					...state,
					userState: {
						...state.userState,
						userSelectedTransaction: contact,
					},
				}));
			},
			updateState: (newState) =>
				set((state) => ({
					...state,
					userState: {
						...state.userState,
						...newState,
					},
				})),
			updateStateInstance: (key, value) =>
				set((state) => ({
					...state,
					userState: {
						...state.userState,
						[key]: value,
					},
				})),
			updatepermissions: (key, value) =>
				set((state) => ({
					...state,
					permissions: {
						...state.permissions,
						[key]: value,
					},
				})),
		}),
		{
			name: "state-management", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
		},
	),
);

type drawState = {
	state: boolean;
	setState: (key: boolean) => void;
};

export const permissionDrawerState = create<drawState>((set) => ({
	state: false,
	setState: (key: boolean) => {
		set({ state: key });
	},
}));
