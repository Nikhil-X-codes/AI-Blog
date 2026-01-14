import { Client } from '@gradio/client';
import dotenv from 'dotenv';

dotenv.config();

class HuggingFaceService {
  constructor() {
    this.spaceUrl = process.env.HUGGINGFACE_SPACE_URL;
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.client = null;
    
    if (!this.spaceUrl || !this.apiKey) {
      throw new Error('HuggingFace API credentials not configured. Please set HUGGINGFACE_SPACE_URL and HUGGINGFACE_API_KEY environment variables.');
    }

    this.spaceName = this.extractSpaceNameFromUrl(this.spaceUrl);
  }

  extractSpaceNameFromUrl(url) {
    if (url.includes('hf.space')) {
      const match = url.match(/https:\/\/([\w-]+)\.hf\.space/);
      if (match) {
        const nameWithDash = match[1];
        const parts = nameWithDash.split('-');
        const owner = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const space = parts.slice(1).join('-');
        return `${owner}/${space}`;
      }
    }
    return url;
  }

  async initializeClient() {
    if (!this.client) {
      this.client = await Client.connect(this.spaceName, {
        hf_token: this.apiKey
      });
    }
    return this.client;
  }

  async generateCompleteBlog(topic, tone) {
    try {

      const toneMap = {
        'professional': 'Professional',
        'fun': 'Fun',
        'concise': 'Concise'
      };
      
      const normalizedTone = toneMap[tone.toLowerCase()] || tone;
      console.log('Tone (normalized):', normalizedTone);
      
      const client = await this.initializeClient();

      const result = await client.predict("/generate_complete_blog", { 
        topic: topic, 
        tone: normalizedTone
      });

      
      const blogText = result.data[0]; 
      const imagesData = result.data[1];

      const processedImages = this.processImageData(imagesData);

      return {
        blogText: blogText,
        images: processedImages
      };
    } catch (error) {
      
      if (error.message?.includes('timeout')) {
        throw new Error('AI generation timeout. Please try again.');
      }
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Invalid HuggingFace API key or token expired. Check HUGGINGFACE_API_KEY.');
      }
      
      if (error.message?.includes('404')) {
        throw new Error('Space not found or endpoint does not exist. Check HUGGINGFACE_SPACE_URL and endpoint name.');
      }
      
      throw new Error(`Failed to generate blog content: ${error.message}`);
    }
  }


  processImageData(images) {
    
    if (!images) {
      console.log('❌ Images is null/undefined');
      return [];
    }

    let imageArray = images;
    
    if (!Array.isArray(images) && images?.value) {
      imageArray = images.value;
    }

    if (!Array.isArray(imageArray)) {
      console.log('❌ Images is not an array after processing');
      return [];
    }

    if (imageArray.length === 0) {
      console.log('⚠️ Images array is empty - Check if UNSPLASH_API_KEY is set in Gradio Space');
      return [];
    }

    const processed = imageArray.map((img, index) => {
      
      let imageUrl = '';
      
      if (typeof img === 'string') {
        imageUrl = img;
      } else if (img?.image?.url) {
        imageUrl = img.image.url;
      } else if (img?.url) {
        imageUrl = img.url;
      } else if (img?.image?.path) {
        imageUrl = `${this.spaceUrl}/file=${img.image.path}`;
      } else if (img?.path) {
        imageUrl = `${this.spaceUrl}/file=${img.path}`;
      } else if (Array.isArray(img) && img.length > 0) {
        if (typeof img[0] === 'string') {
          imageUrl = img[0];
        } else if (img[0]?.url) {
          imageUrl = img[0].url;
        } else if (img[0]?.path) {
          imageUrl = `${this.spaceUrl}/file=${img[0].path}`;
        }
      }
      return {
        url: imageUrl,
        prompt: img?.caption || img?.prompt || img?.[1] || `Blog Image ${index + 1}`,
        source: 'huggingface',
        index: index
      };
    }).filter(img => {
      const hasUrl = !!img.url;
      if (!hasUrl) {
        console.log('⚠️ Filtered out image with no URL');
      }
      return hasUrl;
    });
    
    return processed;
  }


  async rewriteText(text, tone) {
    try {
      const toneMap = {
        'professional': 'Professional',
        'fun': 'Fun',
        'concise': 'Concise'
      };
      const normalizedTone = toneMap[tone?.toLowerCase?.()] || tone;

      const client = await this.initializeClient();

      const result = await client.predict("/rewrite_text", {
        text: text,
        tone: normalizedTone
      });

      return result.data[0] || text;
    } catch (error) {
      console.error('Rewrite Error:', error.message);
      throw new Error('Failed to rewrite text.');
    }
  }

  async improveSEO(text, keywords) {
    try {
      const client = await this.initializeClient();

      const result = await client.predict("/improve_seo", {
        text: text,
        keywords: keywords
      });

      return result.data[0] || text;
    } catch (error) {
      console.error('SEO Improvement Error:', error.message);
      throw new Error('Failed to improve SEO.');
    }
  }


  async changeTone(text, newTone) {
    try {
      const toneMap = {
        'professional': 'Professional',
        'fun': 'Fun',
        'concise': 'Concise'
      };
      const normalizedTone = toneMap[newTone?.toLowerCase?.()] || newTone;

      const client = await this.initializeClient();

      const result = await client.predict("/change_tone", {
        text: text,
        new_tone: normalizedTone
      });

      return result.data[0] || text;
    } catch (error) {
      console.error('Tone Change Error:', error.message);
      throw new Error('Failed to change tone.');
    }
  }

}


export default new HuggingFaceService();
