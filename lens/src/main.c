#include <stdio.h>
#include <SDL.h>

int main(int argc, char **argv)
{
	if(!SDL_Init(SDL_INIT_EVERYTHING))
	{
		printf("SDL_Init Error:%s\n",SDL_GetError());
		return 1;
	}	
	return 0;
}