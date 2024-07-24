import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, updateProfile, User, setPersistence, browserSessionPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
    });
  }

  async setPersistence() {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
    } catch (error) {
      console.error("Error setting persistence: ", error);
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      await this.setPersistence();
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      this.currentUserSubject.next(user);
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Error during registration: ", error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUserSubject.next(userCredential.user);
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Error during login: ", error);
    }
  }

  async loginWithGoogle() {
    try {
      await this.setPersistence();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.currentUserSubject.next(result.user);
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Error during Google login: ", error);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  }

  getUser() {
    return this.auth.currentUser;
  }
}

