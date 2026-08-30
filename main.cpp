#include <iostream> // Short for "Input/Output Stream".
#include <string> // Imports C++ standard string

using namespace std; //Prevents you from having to type std:: before every C++ standard function (e.g., writing cout instead of std::cout).

bool isPalindrome(string s) {
    int start = 0;
    int end = s.length()-1;
    while(start < end) {
        if(s[start] != s[end]){
            return false;
        }
        start++;
        end--;

    }
    return true;
}

int main(){
    string text = "racecar";
    bool  a = isPalindrome(text);
    cout << text << "is a palindrome" << endl;
    return 0;
}