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

typedef struct 
{
	float a;
	float r;
	float g;
	float b;
} rnd_color;

typedef struct 
{
	float x;
	float y;
	float z;
} rnd_vector3;

typedef struct
{
	rnd_vector3 left_top;
	rnd_vector3 lef_bottom;
	rnd_vector3 right_top;
	rnd_vector3 eye;
} rnd_camera;

typedef struct 
{
	rnd_vector3 pt1;
	rnd_vector3 pt2;
	rnd_vector3 pt3;
} rnd_triangle;

typedef struct 
{
	rnd_camera *camera;
	rnd_triangle *objects;
} rnd_scene;


typedef struct
{
	rnd_vector3 direction;
	rnd_vector3 origin;
	float refraction_index;
} rnd_ray;

rnd_ray* rnd_getray(int x, int y)
{
	rnd_ray* ray;
	ray=(rnd_ray *)malloc(sizeof(rnd_ray));

	return ray;
}

typedef struct 
{
	float width;
	float height;
	int *buffer;
	rnd_scene *scene;
} job_desc;

job_desc* job_create()
{
	job_desc *job;

	job=(job_desc*) malloc(sizeof(job_desc));
	job->scene=(rnd_scene*) malloc(sizeof(rnd_scene));

	return job;
}

void job_delete(job_desc* job)
{
	free(job->scene);
	free(job);
}

job_desc* job_demo()
{
	job_desc *job;

	job = job_create();

	job->width=1280;
	job->height=720;

	job->buffer = malloc(sizeof(int)*job->width*job->height);

	return job;
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

int render(job_desc *job)
{
	int x=0;
	int y=0;
	int width=job->width;
	int height=job->height;
	int *buffer=job->buffer;

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

int main(int argc, char* argv)
{
	job_desc *job;

	job = job_demo();

	render(job);

	ppm_create("image.ppm",job->width,job->height,255,job->buffer);

	free(job->buffer);
	job_delete(job);

	return 0;
}