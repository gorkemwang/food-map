import {defineStore} from 'pinia';
import {login, loginCheck} from '@/api/AuthService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        username: '',
        roles: []
    }),
    persist: {
        enable: true
    },
    actions: {
        async checkLoginStatus() {
            const jsessionid = localStorage.getItem('id');
            if (!jsessionid) {
                this.logout();
                return;
            }

            try {
                await loginCheck();
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error checking login status:', error);
                this.logout();
            }
        },
        async userLogin(loginForm) {
            try {
                const response = await login(loginForm);
                const {username, roles} = response.data;
                this.username = username;
                this.roles = roles;
            } catch (error) {
                console.error('Error during login:', error);
                this.logout();
                throw error;
            }
        },
        logout() {
            // localStorage.removeItem('id');
            this.username = '';
            this.roles = [];
        }
    }
});