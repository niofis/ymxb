//For ASCII banners:
//http://www.desmoulins.fr/index_us.php?pg=scripts!online!asciiart
//font: banner3

/*
##       ####  ######   ##     ## ######## 
##        ##  ##    ##  ##     ##    ##    
##        ##  ##        ##     ##    ##    
##        ##  ##   #### #########    ##    
##        ##  ##    ##  ##     ##    ##    
##        ##  ##    ##  ##     ##    ##    
######## ####  ######   ##     ##    ##    
*/

//I'm tired of fiddling around with so many text files
//let's try something different.

#include <stdio.h>
#include <stdlib.h>

/*
 ######   ##        #######  ########     ###    ##          ########  ######## ########  ######  
##    ##  ##       ##     ## ##     ##   ## ##   ##          ##     ## ##       ##       ##    ## 
##        ##       ##     ## ##     ##  ##   ##  ##          ##     ## ##       ##       ##       
##   #### ##       ##     ## ########  ##     ## ##          ##     ## ######   ######    ######  
##    ##  ##       ##     ## ##     ## ######### ##          ##     ## ##       ##             ## 
##    ##  ##       ##     ## ##     ## ##     ## ##          ##     ## ##       ##       ##    ## 
 ######   ########  #######  ########  ##     ## ########    ########  ######## ##        ######  
 */
#if !defined(byte)
	#define byte unsigned char
#endif

#define int int32_t

#define BPP 4

/*
########  ########  ##     ## 
##     ## ##     ## ###   ### 
##     ## ##     ## #### #### 
########  ########  ## ### ## 
##        ##        ##     ## 
##        ##        ##     ## 
##        ##        ##     ## 
*/

char* ppm_magic = "P6";

int ppm_create(char* filename, int width, int height, short max_color, int* data)
{
	int x=0;
	int y=0;
	FILE *file;
	file = fopen(filename,"w+");
	if(file)
	{
		fprintf(file,"%s %i %i %i ",ppm_magic,width,height,max_color);

		for(y=0;y<height;++y)
		{
			for(x=0;x<width;++x)
			{
				int p = y*height + x;
				//gets the address for the pixel data
				byte* pixel=(byte*)(data + p);
				fputc(pixel[1],file);
				fputc(pixel[2],file);
				fputc(pixel[3],file);
			}
		}

		fclose(file);
	}
	else
	{
		return 1;
	}
	return 0;
}

/*
########  ######## ##    ## ########  ######## ########  
##     ## ##       ###   ## ##     ## ##       ##     ## 
##     ## ##       ####  ## ##     ## ##       ##     ## 
########  ######   ## ## ## ##     ## ######   ########  
##   ##   ##       ##  #### ##     ## ##       ##   ##   
##    ##  ##       ##   ### ##     ## ##       ##    ##  
##     ## ######## ##    ## ########  ######## ##     ## 
*/

int render(int width, int height, int* buffer)
{
	int x=0;
	int y=0;
	for(y=0;y<height;++y)
	{
		for(x=0;x<width;++x)
		{
			int p=(y*height + x);
			//ARGB
			buffer[p]=0xFF0000FF;
		}
	}
	return 0;
}


/*
##     ##    ###    #### ##    ## 
###   ###   ## ##    ##  ###   ## 
#### ####  ##   ##   ##  ####  ## 
## ### ## ##     ##  ##  ## ## ## 
##     ## #########  ##  ##  #### 
##     ## ##     ##  ##  ##   ### 
##     ## ##     ## #### ##    ## 
*/
int main(int argc, char* argv)
{
	int width;
	int height;
	int* buffer;

	width=640;
	height=480;

	buffer=(int*)malloc(sizeof(int)*width*height);

	render(width,height,buffer);

	ppm_create("image.ppm",width,height,255,buffer);

	free(buffer);

	return 0;
}